package com.omoikane.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.omoikane.api.entity.CareerApplication;
import com.omoikane.api.entity.ContactSubmission;
import org.junit.jupiter.api.Test;

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
    void buildContactEmailHtml_containsRequiredWordingAndRecipientName() {
        ResendEmailService service = new ResendEmailService("key", "info@example.com");
        String html = service.buildContactEmailHtml("John Doe");

        assertTrue(html.contains("Dear John Doe,"), "Must personalize greeting");
        assertTrue(html.contains("Thank you for reaching out to Omoikane Innovations."), "Must contain thank you message");
        assertTrue(html.contains("We have successfully received your message. Our team will review your enquiry and get back to you as soon as possible."), "Must contain confirmation message");
        assertTrue(html.contains("We appreciate your interest in our company."), "Must contain appreciation message");
        assertTrue(html.contains("Best regards,"), "Must contain sign-off");
        assertTrue(html.contains("Team Omoikane Innovations"), "Must contain sender team");
    }

    @Test
    void buildCareerEmailHtml_containsRequiredFieldsAndActualDatabaseId() {
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
    }
}
