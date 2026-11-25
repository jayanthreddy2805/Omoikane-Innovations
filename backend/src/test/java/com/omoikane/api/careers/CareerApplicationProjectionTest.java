package com.omoikane.api.careers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.*;
@DataJpaTest @ActiveProfiles("test")
class CareerApplicationProjectionTest {
    @Autowired CareerApplicationRepository repository;
    @Test void summaryReturnsSizeWithoutHydratingResumeEntity(){
        CareerApplication app=new CareerApplication();app.setName("Test");app.setEmail("test@example.com");
        app.setDepartment("software");app.setRoleId("web-dev");app.setMessage("Application");
        app.setResumeFilename("cv.pdf");app.setResumeContentType("application/pdf");app.setResumeData(new byte[1024*1024]);
        repository.saveAndFlush(app);
        var rows=repository.findApplicationSummaries();assertEquals(1,rows.size());
        var summary=CareerApplicationSummary.fromProjection(rows.getFirst());
        assertEquals(1024*1024,summary.getResumeSize());assertEquals("Test",summary.getName());assertEquals(app.getId(),summary.getId());assertNotNull(summary.getCreatedAt());
    }
}
