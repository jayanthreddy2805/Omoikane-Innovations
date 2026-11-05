package com.omoikane.api.email;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.omoikane.api.careers.CareerApplication;
import com.omoikane.api.contact.ContactSubmission;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ResendEmailServiceTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void isConfigured_returnsFalse_whenApiKeyBlank() {
        ResendEmailService service = new ResendEmailService("", "sender@example.com");
        assertFalse(service.isConfigured());
    }

    @Test
    void isConfigured_returnsFalse_whenFromEmailBlank() {
        ResendEmailService service = new ResendEmailService("re_some_key", "");
        assertFalse(service.isConfigured());
    }

    @Test
    void isConfigured_returnsTrue_whenBothSet() {
        ResendEmailService service = new ResendEmailService("re_some_key", "noreply@example.com");
        assertTrue(service.isConfigured());
    }

    @Test
    void sendConfirmation_skipsWhenNotConfigured() {
        ResendEmailService service = new ResendEmailService("", "");
        ContactSubmission sub = new ContactSubmission();
        sub.setName("Test");
        sub.setEmail("test@example.com");
        sub.setMessage("Hello");

        boolean result = service.sendConfirmation(sub);
        assertFalse(result);
    }

    @Test
    void sendCareerConfirmation_skipsWhenNotConfigured() {
        ResendEmailService service = new ResendEmailService("", "");
        CareerApplication app = new CareerApplication();
        app.setName("Test Applicant");
        app.setEmail("applicant@example.com");
        app.setDepartment("software");
        app.setRoleId("web-dev");

        boolean result = service.sendCareerConfirmation(app);
        assertFalse(result);
    }

    @Test
    void getFromHeader_formatsWithName_whenProvided() {
        ResendEmailService service = new ResendEmailService("key", "info@example.com", "Omoikane Innovations");
        assertEquals("Omoikane Innovations <info@example.com>", service.getFromHeader());
    }

    @Test
    void getFromHeader_returnsOnlyEmail_whenNameEmpty() {
        ResendEmailService service = new ResendEmailService("key", "info@example.com", "");
        assertEquals("info@example.com", service.getFromHeader());
    }

    @Test
    void buildContactEmailHtml_containsRequiredWordingAndRecipientNameAndLogo() {
        ResendEmailService service = new ResendEmailService("key", "info@example.com");
        String html = service.buildContactEmailHtml("John Doe");

        assertTrue(html.contains("Dear John Doe,"), "Must personalize greeting");
        assertTrue(html.contains("Thank you for reaching out to Omoikane Innovations."), "Must contain thank you message");
        assertTrue(html.contains("We have successfully received your message. Our team will review your enquiry and get back to you as soon as possible."), "Must contain confirmation message");
        assertTrue(html.contains("We appreciate your interest in our company."), "Must contain appreciation message");
        assertTrue(html.contains("Best regards,"), "Must contain sign-off");
        assertTrue(html.contains("Team Omoikane Innovations"), "Must contain sender team");
        assertTrue(html.contains("omoikane-logo.png"), "Must contain company logo");
        assertTrue(html.contains("Omoikane Innovations</span>"), "Must display company name beside logo");
    }

    @Test
    void buildCareerEmailHtml_containsRequiredFieldsAndActualDatabaseIdAndLogo() {
        ResendEmailService service = new ResendEmailService("key", "info@example.com");
        Long actualDatabaseId = 1042L;
        String html = service.buildCareerEmailHtml("Jane Smith", actualDatabaseId, "software", "Web Developer");

        assertTrue(html.contains("Dear Jane Smith,"), "Must personalize greeting with applicant name");
        assertTrue(html.contains("Thank you for applying to Omoikane Innovations."), "Must contain thank you message");
        assertTrue(html.contains("We have successfully received your job application."), "Must contain receipt message");
        assertTrue(html.contains("Your application details:"), "Must contain details section header");
        assertTrue(html.contains("1042"), "Must contain the actual database-generated application ID");
        assertTrue(html.contains("Software"), "Must contain formatted department");
        assertTrue(html.contains("Web Developer"), "Must contain role title");
        assertTrue(html.contains("Application Received"), "Must contain application status");
        assertTrue(html.contains("Our recruitment team will carefully review your application."), "Must contain review message");
        assertTrue(html.contains("Recruitment Team<br/>Omoikane Innovations"), "Must contain recruitment team sign-off");
        assertTrue(html.contains("omoikane-logo.png"), "Must contain company logo");
    }

    @Test
    void buildEmailJson_producesValidJsonWithAllFields() throws Exception {
        ResendEmailService service = new ResendEmailService("key", "careers@omoikane.com", "Omoikane Innovations");
        String json = service.buildEmailJson("candidate@example.com", "Application Received – Web Developer | Omoikane Innovations", "<p>Body</p>");

        JsonNode root = objectMapper.readTree(json);
        assertEquals("Omoikane Innovations <careers@omoikane.com>", root.get("from").asText());
        assertEquals("candidate@example.com", root.get("to").get(0).asText());
        assertEquals("Application Received – Web Developer | Omoikane Innovations", root.get("subject").asText());
        assertEquals("<p>Body</p>", root.get("html").asText());
        assertNull(root.get("attachments"));
    }

    @Test
    void buildResumeAttachments_encodesFileBytesToBase64() {
        ResendEmailService service = new ResendEmailService("key", "careers@omoikane.com");
        CareerApplication app = new CareerApplication();
        byte[] samplePdf = "%PDF-1.4 Mock resume content for testing".getBytes(StandardCharsets.UTF_8);
        app.setResumeFilename("john_doe_resume.pdf");
        app.setResumeData(samplePdf);

        List<Map<String, Object>> attachments = service.buildResumeAttachments(app);
        assertNotNull(attachments);
        assertEquals(1, attachments.size());
        assertEquals("john_doe_resume.pdf", attachments.get(0).get("filename"));
        assertEquals(Base64.getEncoder().encodeToString(samplePdf), attachments.get(0).get("content"));
    }

    @Test
    void buildResumeAttachments_handlesEmptyOrNullGracefully() {
        ResendEmailService service = new ResendEmailService("key", "careers@omoikane.com");
        assertTrue(service.buildResumeAttachments(null).isEmpty());

        CareerApplication appWithoutResume = new CareerApplication();
        assertTrue(service.buildResumeAttachments(appWithoutResume).isEmpty());
    }

    @Test
    void buildEmailJson_includesAttachmentsWhenPresent() throws Exception {
        ResendEmailService service = new ResendEmailService("key", "careers@omoikane.com", "Omoikane Innovations");
        Map<String, Object> attachment = Map.of(
                "filename", "cv.pdf",
                "content", "dGVzdC1jb250ZW50"
        );

        String json = service.buildEmailJson("candidate@example.com", "Subject", "<p>Hi</p>", List.of(attachment));
        JsonNode root = objectMapper.readTree(json);

        assertNotNull(root.get("attachments"));
        assertEquals(1, root.get("attachments").size());
        assertEquals("cv.pdf", root.get("attachments").get(0).get("filename").asText());
        assertEquals("dGVzdC1jb250ZW50", root.get("attachments").get(0).get("content").asText());
    }

    @Test
    void buildAdminCareerAlertHtml_includesLogoAndResumeNotice() {
        ResendEmailService service = new ResendEmailService("key", "info@example.com");
        CareerApplication app = new CareerApplication();
        app.setName("Alice Cooper");
        app.setEmail("alice@example.com");
        app.setDepartment("software");
        app.setRoleTitle("Lead Architect");
        app.setResumeFilename("alice_cv.pdf");
        app.setMessage("Excited to apply!");

        String html = service.buildAdminCareerAlertHtml(app);
        assertTrue(html.contains("omoikane-logo.png"), "Admin template must include company logo");
        assertTrue(html.contains("Alice Cooper"), "Must display applicant name");
        assertTrue(html.contains("alice_cv.pdf (Attached to this email)"), "Must indicate resume is attached");
    }
}
