package com.omoikane.api.email;
import com.omoikane.api.contact.*;
import com.omoikane.api.careers.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@SpringBootTest @ActiveProfiles("test")
class EmailOutboxIntegrationTest {
    @Autowired ContactService service;
    @Autowired ContactSubmissionRepository contacts;
    @Autowired CareerApplicationRepository careers;
    @Autowired EmailDeliveryJobRepository jobs;
    @Autowired EmailOutbox outbox;
    @Autowired PlatformTransactionManager transactions;
    @Autowired org.springframework.jdbc.core.JdbcTemplate jdbc;
    @MockitoBean ResendEmailService email;
    @BeforeEach void clear(){jobs.deleteAll();contacts.deleteAll();}
    ContactRequest request(){var req=new ContactRequest();req.setName("Test");req.setEmail("outbox@example.com");req.setMessage("Enquiry");return req;}
    @Test void rollbackRemovesSubmissionAndJobsWithoutSending(){
        new TransactionTemplate(transactions).execute(status->{service.processContactRequest(request(),"127.0.0.1");assertEquals(2,jobs.count());status.setRollbackOnly();return null;});
        assertEquals(0,contacts.count());assertEquals(0,jobs.count());verifyNoInteractions(email);
    }
    @Test void committedJobsSendLaterAndAreNotSentAgain(){
        var saved=service.processContactRequest(request(),"127.0.0.1");
        assertEquals(2,jobs.count());verifyNoInteractions(email);
        when(email.isConfigured()).thenReturn(true);when(email.sendConfirmation(any())).thenReturn(true);when(email.sendAdminContactAlert(any())).thenReturn(true);
        var worker=new EmailDeliveryWorker(outbox,email,contacts,careers);worker.poll();worker.poll();
        verify(email,times(1)).sendConfirmation(any());verify(email,times(1)).sendAdminContactAlert(any());
        assertTrue(contacts.findById(saved.getId()).orElseThrow().isEmailSent());assertTrue(jobs.findAll().stream().allMatch(j->"SENT".equals(j.getStatus())));
    }
    @Test void temporaryFailureSchedulesBoundedRetry(){
        service.processContactRequest(request(),"127.0.0.1");when(email.isConfigured()).thenReturn(true);
        when(email.sendConfirmation(any())).thenThrow(new EmailDeliveryException());when(email.sendAdminContactAlert(any())).thenReturn(true);
        new EmailDeliveryWorker(outbox,email,contacts,careers).poll();
        var retry=jobs.findAll().stream().filter(j->"CONTACT_CONFIRMATION".equals(j.getKind())).findFirst().orElseThrow();
        assertEquals("PENDING",retry.getStatus());assertEquals(1,retry.getAttempts());assertTrue(retry.getNextAttemptAt().isAfter(java.time.OffsetDateTime.now()));
    }
    @Test void expiredWorkerCannotCompleteOrRescheduleRecoveredLease(){
        service.processContactRequest(request(),"127.0.0.1");
        var oldClaim=outbox.claim();
        jdbc.update("update email_delivery_jobs set next_attempt_at = ? where id = ?",java.time.OffsetDateTime.now().minusMinutes(1),oldClaim.getId());
        var currentClaim=outbox.claim();
        assertEquals(oldClaim.getId(),currentClaim.getId());
        assertEquals(2,currentClaim.getAttempts());
        outbox.finish(oldClaim,"SENT",false);
        outbox.finish(oldClaim,"FAILED",true);
        assertEquals("PROCESSING",jobs.findById(currentClaim.getId()).orElseThrow().getStatus());
        outbox.finish(currentClaim,"SENT",false);
        assertEquals("SENT",jobs.findById(currentClaim.getId()).orElseThrow().getStatus());
    }

    @Test void crashedFinalAttemptIsNotSentAgain(){
        service.processContactRequest(request(),"127.0.0.1");
        EmailDeliveryJob job=outbox.claim();
        org.springframework.test.util.ReflectionTestUtils.setField(job,"attempts",4);
        org.springframework.test.util.ReflectionTestUtils.setField(job,"nextAttemptAt",java.time.OffsetDateTime.now().minusMinutes(1));
        jobs.saveAndFlush(job);
        assertNull(outbox.claim());
        assertEquals("FAILED",jobs.findById(job.getId()).orElseThrow().getStatus());
        verifyNoInteractions(email);
    }
}
