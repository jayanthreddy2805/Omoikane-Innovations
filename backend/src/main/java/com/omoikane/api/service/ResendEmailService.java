package com.omoikane.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omoikane.api.entity.CareerApplication;
import com.omoikane.api.entity.ContactSubmission;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Sends confirmation emails via Resend's HTTPS API for Contact enquiries
 * and Careers job applications.
 * <p>
 * If RESEND_API_KEY or RESEND_FROM_EMAIL is not configured, sending is silently
 * skipped so that contact submissions and career applications continue to work
 * without external email infrastructure.
 */
@Service
public class ResendEmailService {

    private static final Logger log = LoggerFactory.getLogger(ResendEmailService.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    private final String apiKey;
    private final String fromEmail;
    private final String fromName;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public ResendEmailService(
            @Value("${app.resend.api-key:}") String apiKey,
            @Value("${app.resend.from-email:}") String fromEmail,
            @Value("${app.resend.from-name:Omoikane Innovations}") String fromName) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.fromEmail = fromEmail != null ? fromEmail.trim() : "";
        this.fromName = fromName != null ? fromName.trim() : "";
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public ResendEmailService(String apiKey, String fromEmail) {
        this(apiKey, fromEmail, "Omoikane Innovations");
    }

    /**
     * Sends a personalized confirmation email to the person who submitted a contact form.
     * Only called after successful database persistence.
     *
     * @return true if the email was accepted by Resend, false if skipped or failed
     */
    public boolean sendConfirmation(ContactSubmission submission) {
        if (!isConfigured()) {
            log.info("Resend not configured — skipping contact confirmation email for submission [id={}]",
                    submission.getId());
            return false;
        }

        String recipientEmail = submission.getEmail();
        String recipientName = submission.getName();

        String subject = "Thank You for Contacting Omoikane Innovations!";
        String htmlContent = buildContactEmailHtml(recipientName);

        return sendEmail(recipientEmail, subject, htmlContent, "contact submission", submission.getId());
    }

    /**
     * Sends a personalized confirmation email to the job applicant with their
     * actual database-generated application ID.
     * Only called after successful database persistence.
     *
     * @return true if the email was accepted by Resend, false if skipped or failed
     */
    public boolean sendCareerConfirmation(CareerApplication application) {
        if (!isConfigured()) {
            log.info("Resend not configured — skipping career confirmation email for application [id={}]",
                    application.getId());
            return false;
        }

        String recipientEmail = application.getEmail();
        String recipientName = application.getName();
        String roleTitle = (application.getRoleTitle() != null && !application.getRoleTitle().isBlank())
                ? application.getRoleTitle().trim()
                : application.getRoleId();
        String department = application.getDepartment();
        Long applicationId = application.getId();

        String subject = "Application Received \u2013 " + roleTitle + " | Omoikane Innovations";
        String htmlContent = buildCareerEmailHtml(recipientName, applicationId, department, roleTitle);

        return sendEmail(recipientEmail, subject, htmlContent, "career application", applicationId);
    }

    public boolean isConfigured() {
        return !apiKey.isBlank() && !fromEmail.isBlank();
    }

    public String getFromHeader() {
        if (!fromName.isBlank()) {
            return "%s <%s>".formatted(fromName, fromEmail);
        }
        return fromEmail;
    }

    private boolean sendEmail(String recipientEmail, String subject, String htmlContent,
                              String contextType, Long entityId) {
        try {
            String jsonPayload = buildEmailJson(recipientEmail, subject, htmlContent);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(RESEND_API_URL))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Resend API accepted confirmation email for {} [id={}]", contextType, entityId);
                return true;
            } else {
                log.warn("Resend API returned status {} for {} [id={}]",
                        response.statusCode(), contextType, entityId);
                return false;
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Email send interrupted for {} [id={}]", contextType, entityId);
            return false;
        } catch (Exception e) {
            log.warn("Email send failed for {} [id={}]: {}", contextType, entityId, e.getMessage());
            return false;
        }
    }

    String buildEmailJson(String toEmail, String subject, String html) {
        try {
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("from", getFromHeader());
            payload.put("to", List.of(toEmail));
            payload.put("subject", subject);
            payload.put("html", html);
            return objectMapper.writeValueAsString(payload);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize email payload to JSON", e);
        }
    }

    String buildContactEmailHtml(String recipientName) {
        String safeName = escapeHtml(recipientName);

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Thank You for Contacting Omoikane Innovations!</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
                  <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 40px 16px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="100%%" style="max-width: 580px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="background-color: #0f172a; padding: 28px 32px; text-align: left;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">Omoikane Innovations</h1>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 32px;">
                              <p style="margin-top: 0; font-size: 16px; color: #0f172a;">Dear %s,</p>
                              <p style="font-size: 15px; color: #334155;">Thank you for reaching out to Omoikane Innovations.</p>
                              <p style="font-size: 15px; color: #334155;">We have successfully received your message. Our team will review your enquiry and get back to you as soon as possible.</p>
                              <p style="font-size: 15px; color: #334155;">We appreciate your interest in our company.</p>
                              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0; font-size: 15px; color: #334155;">Best regards,</p>
                                <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #0f172a;">Team Omoikane Innovations</p>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                              &copy; Omoikane Innovations. All rights reserved.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(safeName);
    }

    String buildCareerEmailHtml(String recipientName, Long applicationId, String department, String roleTitle) {
        String safeName = escapeHtml(recipientName);
        String safeId = applicationId != null ? String.valueOf(applicationId) : "";
        String safeDept = escapeHtml(formatDepartment(department));
        String safeRole = escapeHtml(roleTitle != null ? roleTitle : "");

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Application Received</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
                  <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 40px 16px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="100%%" style="max-width: 580px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="background-color: #0f172a; padding: 28px 32px; text-align: left;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">Omoikane Innovations</h1>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 32px;">
                              <p style="margin-top: 0; font-size: 16px; color: #0f172a;">Dear %s,</p>
                              <p style="font-size: 15px; color: #334155;">Thank you for applying to Omoikane Innovations.</p>
                              <p style="font-size: 15px; color: #334155;">We have successfully received your job application.</p>

                              <div style="margin: 24px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px;">
                                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Your application details:</p>
                                <table role="presentation" width="100%%" cellspacing="0" cellpadding="6" style="font-size: 14px; color: #334155;">
                                  <tr>
                                    <td style="width: 140px; color: #64748b; font-weight: 500;">Application ID:</td>
                                    <td style="font-weight: 600; color: #0f172a;">%s</td>
                                  </tr>
                                  <tr>
                                    <td style="color: #64748b; font-weight: 500;">Department:</td>
                                    <td style="font-weight: 500; color: #0f172a;">%s</td>
                                  </tr>
                                  <tr>
                                    <td style="color: #64748b; font-weight: 500;">Position:</td>
                                    <td style="font-weight: 500; color: #0f172a;">%s</td>
                                  </tr>
                                  <tr>
                                    <td style="color: #64748b; font-weight: 500;">Status:</td>
                                    <td style="font-weight: 600; color: #16a34a;">Application Received</td>
                                  </tr>
                                </table>
                              </div>

                              <p style="font-size: 15px; color: #334155;">Our recruitment team will carefully review your application. If your profile matches our requirements, we will contact you regarding the next steps.</p>
                              <p style="font-size: 15px; color: #334155;">Thank you for your interest in joining Omoikane Innovations.</p>

                              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0; font-size: 15px; color: #334155;">Best regards,</p>
                                <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #0f172a;">Recruitment Team<br/>Omoikane Innovations</p>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                              &copy; Omoikane Innovations. All rights reserved.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(safeName, safeId, safeDept, safeRole);
    }

    static String formatDepartment(String department) {
        if (department == null || department.isBlank()) return "";
        String trimmed = department.trim();
        return Character.toUpperCase(trimmed.charAt(0)) + trimmed.substring(1).toLowerCase();
    }

    static String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
