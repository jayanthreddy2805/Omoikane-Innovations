package com.omoikane.api.email;

import com.omoikane.api.contact.*;
import com.omoikane.api.careers.*;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.data.domain.PageRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import java.sql.DriverManager;
import java.time.OffsetDateTime;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Explicit opt-in: ./mvnw -Dtest=PostgresReadinessIT test. Never accepts a remote database. */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PostgresReadinessIT {
    @DynamicPropertySource
    static void database(DynamicPropertyRegistry properties) throws Exception {
        String url=System.getenv("READINESS_TEST_DATABASE_URL");
        if(url==null || !url.matches("jdbc:postgresql://127\\.0\\.0\\.1:[0-9]+/omoikane_readiness"))
            throw new IllegalStateException("Use the disposable loopback readiness database only");
        String user=System.getenv().getOrDefault("READINESS_TEST_DATABASE_USERNAME",System.getProperty("user.name"));
        String password=System.getenv().getOrDefault("READINESS_TEST_DATABASE_PASSWORD","");
        // Reproduce the observed production V3 schema, with synthetic existing submissions.
        Flyway.configure().dataSource(url,user,password).target("3").load().migrate();
        try(var connection=DriverManager.getConnection(url,user,password);var sql=connection.createStatement()) {
            sql.executeUpdate("insert into contact_submissions(name,email,message) values ('Migration fixture','migration@example.com','Keep this existing enquiry')");
        }
        properties.add("spring.datasource.url",()->url);
        properties.add("spring.datasource.username",()->user);
        properties.add("spring.datasource.password",()->password);
        properties.add("spring.datasource.driver-class-name",()->"org.postgresql.Driver");
        properties.add("spring.jpa.properties.hibernate.dialect",()->"org.hibernate.dialect.PostgreSQLDialect");
        properties.add("spring.jpa.hibernate.ddl-auto",()->"validate");
        properties.add("spring.flyway.enabled",()->true);
        properties.add("app.admin.secret-key",()->"readiness-test-only");
        properties.add("app.cors.allowed-origins",()->"https://www.omoikaneinnovations.com,https://omoikaneinnovations.com,https://omoikane-innovations-3h7t.vercel.app,https://omoikane-innovations-3h7t-git-main-j-f4ac.vercel.app");
    }
    @Autowired JdbcTemplate jdbc;
    @Autowired Flyway flyway;
    @Autowired ContactService contacts;
    @Autowired CareerApplicationService careers;
    @Autowired CareerApplicationRepository applications;
    @Autowired EmailDeliveryJobRepository jobs;
    @Autowired EmailOutbox outbox;
    @Autowired PlatformTransactionManager transactions;
    @Autowired MockMvc mvc;
    @MockitoBean ResendEmailService email;

    @Test void migrationsUpgradeV3WithoutLosingExistingData() {
        flyway.validate();
        assertEquals("5",flyway.info().current().getVersion().toString());
        assertEquals(1,jdbc.queryForObject("select count(*) from contact_submissions where email='migration@example.com'",Integer.class));
        assertEquals(1,jdbc.queryForObject("select count(*) from pg_indexes where indexname='uq_contact_submissions_contact_details'",Integer.class));
        assertEquals(1,jdbc.queryForObject("select count(*) from pg_indexes where indexname='idx_email_delivery_due'",Integer.class));
    }
    @Test void bothSubmissionTypesRollbackWithTheirOutboxJobs() {
        long before=jobs.count();
        new TransactionTemplate(transactions).execute(status->{
            var contact=new ContactRequest();contact.setName("Rollback");contact.setEmail("rollback@example.com");contact.setMessage("Enquiry");
            contacts.processContactRequest(contact,"127.0.0.1");
            try { careers.processApplication(application("rollback-career@example.com")); } catch(Exception error){throw new RuntimeException(error);}
            assertEquals(before+4,jobs.count());status.setRollbackOnly();return null;
        });
        assertEquals(before,jobs.count());
        assertEquals(0,jdbc.queryForObject("select count(*) from career_applications where email='rollback-career@example.com'",Integer.class));
        org.mockito.Mockito.verifyNoInteractions(email);
    }
    @Test void lockedJobDoesNotBlockAnotherWorker() {
        var contact=new ContactRequest();contact.setName("Concurrency");contact.setEmail("concurrency@example.com");contact.setMessage("Enquiry");
        contacts.processContactRequest(contact,"127.0.0.1");
        new TransactionTemplate(transactions).execute(status->{
            var locked=jobs.findDue(OffsetDateTime.now(),PageRequest.of(0,1)).getFirst();
            try {
                var second=CompletableFuture.supplyAsync(outbox::claim).get(3,TimeUnit.SECONDS);
                assertNotNull(second);assertNotEquals(locked.getId(),second.getId());
            } catch(Exception error){throw new RuntimeException(error);}
            return null;
        });
    }
    @Test void postgresProjectionAndAuthenticatedDownloadWork() throws Exception {
        var saved=careers.processApplication(application("download@example.com"));
        var row=applications.findApplicationSummaries().stream().filter(x->x.getId().equals(saved.getId())).findFirst().orElseThrow();
        assertEquals(9,row.getResumeSize());
        var listing=mvc.perform(get("/api/admin/careers").header("X-Admin-Key","readiness-test-only")).andReturn();
        if(listing.getResolvedException()!=null)throw new AssertionError("Admin listing failed",listing.getResolvedException());
        assertEquals(200,listing.getResponse().getStatus());
        mvc.perform(get("/api/admin/careers/"+saved.getId()+"/resume")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/careers/"+saved.getId()+"/resume").header("X-Admin-Key","readiness-test-only"))
            .andExpect(status().isOk()).andExpect(header().string("Content-Disposition",org.hamcrest.Matchers.containsString("attachment")))
            .andExpect(content().bytes("%PDF-test".getBytes(java.nio.charset.StandardCharsets.UTF_8)));
    }
    @Test void intendedFrontendOriginsPassPreflightAndUnknownOriginsFail() throws Exception {
        for(String origin:java.util.List.of("https://www.omoikaneinnovations.com","https://omoikaneinnovations.com",
                "https://omoikane-innovations-3h7t.vercel.app","https://omoikane-innovations-3h7t-git-main-j-f4ac.vercel.app")) {
            mvc.perform(options("/api/contact").header("Origin",origin).header("Access-Control-Request-Method","POST")
                    .header("Access-Control-Request-Headers","content-type"))
                .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin",origin));
        }
        mvc.perform(options("/api/contact").header("Origin","https://untrusted.example").header("Access-Control-Request-Method","POST"))
            .andExpect(status().isForbidden());
    }
    @Test void contactApiPersistsJobsAndRejectsDuplicatesAndHoneypots() throws Exception {
        String body="{\"name\":\"API fixture\",\"email\":\"api-fixture@example.com\",\"message\":\"Synthetic API enquiry\"}";
        long before=jobs.count();
        mvc.perform(post("/api/contact").contentType("application/json").content(body)).andExpect(status().isCreated());
        assertEquals(before+2,jobs.count());
        mvc.perform(post("/api/contact").contentType("application/json").content(body)).andExpect(status().isConflict());
        mvc.perform(post("/api/contact").contentType("application/json").content(body.replace("Synthetic API enquiry"," "))).andExpect(status().isBadRequest());
        mvc.perform(post("/api/contact").contentType("application/json").content(body.replace("{","{\"website\":\"spam\","))).andExpect(status().isBadRequest());
        assertEquals(before+2,jobs.count());
    }
    private CareerApplicationRequest application(String address) {
        var request=new CareerApplicationRequest();request.setName("Readiness fixture");request.setEmail(address);
        request.setDepartment("electronics");request.setRole("prod-eng-elec");request.setMessage("Synthetic application");
        request.setResume(new MockMultipartFile("resume","fixture.pdf","application/pdf","%PDF-test".getBytes(java.nio.charset.StandardCharsets.UTF_8)));
        return request;
    }
}
