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
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Sends confirmation and notification emails via Resend's HTTPS API for
 * Contact enquiries and Careers job applications.
 * <p>
 * Supports email attachments (e.g. candidate resumes) and branded header templates
 * with company logo for both user confirmations and admin alerts.
 * <p>
 * If RESEND_API_KEY or RESEND_FROM_EMAIL is not configured, sending is silently
 * skipped so that contact submissions and career applications continue to work
 * without external email infrastructure.
 */
@Service
public class ResendEmailService {

    private static final Logger log = LoggerFactory.getLogger(ResendEmailService.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";
    public static final String DEFAULT_LOGO_URL = "https://raw.githubusercontent.com/jayanthreddy2805/Omoikane-Innovations/main/frontend/public/omoikane-logo.png";

    private final String apiKey;
    private final String fromEmail;
    private final String fromName;
    private final String adminEmail;
    private final String logoUrl;
    private final String adminDashboardUrl;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public ResendEmailService(
            @Value("${app.resend.api-key:}") String apiKey,
            @Value("${app.resend.from-email:}") String fromEmail,
            @Value("${app.resend.from-name:Omoikane Innovations}") String fromName,
            @Value("${app.resend.admin-email:}") String adminEmail,
            @Value("${app.resend.logo-url:https://raw.githubusercontent.com/jayanthreddy2805/Omoikane-Innovations/main/frontend/public/omoikane-logo.png}") String logoUrl,
            @Value("${app.admin.dashboard-url:https://www.omoikaneinnovations.com/admin}") String adminDashboardUrl) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.fromEmail = fromEmail != null ? fromEmail.trim() : "";
        this.fromName = fromName != null ? fromName.trim() : "";
        this.adminEmail = adminEmail != null ? adminEmail.trim() : "";
        this.logoUrl = (logoUrl != null && !logoUrl.isBlank()) ? logoUrl.trim() : DEFAULT_LOGO_URL;
        this.adminDashboardUrl = (adminDashboardUrl != null && !adminDashboardUrl.isBlank())
                ? adminDashboardUrl.trim()
                : "https://www.omoikaneinnovations.com/admin";
        this.httpClient = HttpClient.newBuilder()

                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public ResendEmailService(String apiKey, String fromEmail, String fromName, String adminEmail) {
        this(apiKey, fromEmail, fromName, adminEmail, DEFAULT_LOGO_URL, "https://www.omoikaneinnovations.com/admin");
    }

    public ResendEmailService(String apiKey, String fromEmail, String fromName) {
        this(apiKey, fromEmail, fromName, "", DEFAULT_LOGO_URL, "https://www.omoikaneinnovations.com/admin");
    }

    public ResendEmailService(String apiKey, String fromEmail) {
        this(apiKey, fromEmail, "Omoikane Innovations", "", DEFAULT_LOGO_URL, "https://www.omoikaneinnovations.com/admin");
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    /**
     * Builds Resend attachment payload list from candidate's resume data.
     */
    public List<Map<String, Object>> buildResumeAttachments(CareerApplication application) {
        if (application == null || application.getResumeData() == null || application.getResumeData().length == 0) {
            return List.of();
        }

        String filename = application.getResumeFilename();
        if (filename == null || filename.isBlank()) {
            filename = "resume.pdf";
        }

        String base64Content = Base64.getEncoder().encodeToString(application.getResumeData());
        Map<String, Object> attachment = new LinkedHashMap<>();
        attachment.put("filename", filename);
        attachment.put("content", base64Content);
        return List.of(attachment);
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

        return sendEmail(recipientEmail, subject, htmlContent, null, "contact submission", submission.getId());
    }

    /**
     * Sends a personalized confirmation email to the job applicant with their
     * actual database-generated application ID and attached resume.
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
        String htmlContent = buildCareerEmailHtml(recipientName, applicationId, department, roleTitle, application.getResumeFilename());
        List<Map<String, Object>> attachments = buildResumeAttachments(application);

        return sendEmail(recipientEmail, subject, htmlContent, attachments, "career application", applicationId);
    }

    /**
     * Sends an instant notification email to the admin/manager whenever a new contact inquiry arrives.
     */
    public boolean sendAdminContactAlert(ContactSubmission submission) {
        if (!isConfigured() || adminEmail.isBlank()) {
            return false;
        }

        String company = (submission.getCompany() != null && !submission.getCompany().isBlank())
                ? submission.getCompany().trim()
                : "Individual";
        String subject = "[New Enquiry] " + submission.getName() + " (" + company + ")";
        String htmlContent = buildAdminContactAlertHtml(submission);

        return sendEmail(adminEmail, subject, htmlContent, null, "admin contact alert", submission.getId());
    }

    /**
     * Sends an instant notification email to the admin/manager whenever a new job application arrives,
     * with the candidate's resume attached directly to the email.
     */
    public boolean sendAdminCareerAlert(CareerApplication application) {
        if (!isConfigured() || adminEmail.isBlank()) {
            return false;
        }

        String role = (application.getRoleTitle() != null && !application.getRoleTitle().isBlank())
                ? application.getRoleTitle().trim()
                : application.getRoleId();
        String subject = "[New Job Application] " + role + " - " + application.getName();
        String htmlContent = buildAdminCareerAlertHtml(application);
        List<Map<String, Object>> attachments = buildResumeAttachments(application);

        return sendEmail(adminEmail, subject, htmlContent, attachments, "admin career alert", application.getId());
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
        return sendEmail(recipientEmail, subject, htmlContent, null, contextType, entityId);
    }

    private boolean sendEmail(String recipientEmail, String subject, String htmlContent,
                              List<Map<String, Object>> attachments,
                              String contextType, Long entityId) {
        try {
            String jsonPayload = buildEmailJson(recipientEmail, subject, htmlContent, attachments);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(RESEND_API_URL))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(20))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Resend API accepted {} email for [id={}]", contextType, entityId);
                return true;
            } else {
                log.warn("Resend API returned status {} for {} [id={}]: {}",
                        response.statusCode(), contextType, entityId, response.body());
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
        return buildEmailJson(toEmail, subject, html, null);
    }

    String buildEmailJson(String toEmail, String subject, String html, List<Map<String, Object>> attachments) {
        try {
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("from", getFromHeader());
            payload.put("to", List.of(toEmail));
            payload.put("subject", subject);
            payload.put("html", html);
            if (attachments != null && !attachments.isEmpty()) {
                payload.put("attachments", attachments);
            }
            return objectMapper.writeValueAsString(payload);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize email payload to JSON", e);
        }
    }

    String buildContactEmailHtml(String recipientName) {
        String safeName = escapeHtml(recipientName);
        String safeLogoUrl = escapeHtml(getLogoUrl());

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
                            <td style="background-color: #0f172a; padding: 22px 28px; text-align: left;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="vertical-align: middle;">
                                <tr>
                                  <td style="vertical-align: middle; padding-right: 14px; width: 40px;">
                                    <img src="%s" alt="Omoikane Innovations" width="40" height="40" border="0" style="display: block; width: 40px; height: 40px; max-width: 40px; max-height: 40px; border: 0; outline: none; text-decoration: none;" />
                                  </td>
                                  <td style="vertical-align: middle;">
                                    <span style="color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: inline-block; vertical-align: middle;">Omoikane Innovations</span>
                                  </td>
                                </tr>
                              </table>
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
                """.formatted(safeLogoUrl, safeName);
    }

    String buildCareerEmailHtml(String recipientName, Long applicationId, String department, String roleTitle) {
        return buildCareerEmailHtml(recipientName, applicationId, department, roleTitle, null);
    }

    String buildCareerEmailHtml(String recipientName, Long applicationId, String department, String roleTitle, String resumeFilename) {
        String safeName = escapeHtml(recipientName);
        String safeId = applicationId != null ? String.valueOf(applicationId) : "";
        String safeDept = escapeHtml(formatDepartment(department));
        String safeRole = escapeHtml(roleTitle != null ? roleTitle : "");
        String safeLogoUrl = escapeHtml(getLogoUrl());

        String resumeRow = "";
        if (resumeFilename != null && !resumeFilename.isBlank()) {
            resumeRow = """
                    <tr>
                      <td style="color: #64748b; font-weight: 500;">Resume:</td>
                      <td style="font-weight: 600; color: #0757C8;">&#128206; %s (Attached)</td>
                    </tr>
                    """.formatted(escapeHtml(resumeFilename));
        }

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
                            <td style="background-color: #0f172a; padding: 22px 28px; text-align: left;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="vertical-align: middle;">
                                <tr>
                                  <td style="vertical-align: middle; padding-right: 14px; width: 40px;">
                                    <img src="%s" alt="Omoikane Innovations" width="40" height="40" border="0" style="display: block; width: 40px; height: 40px; max-width: 40px; max-height: 40px; border: 0; outline: none; text-decoration: none;" />
                                  </td>
                                  <td style="vertical-align: middle;">
                                    <span style="color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: inline-block; vertical-align: middle;">Omoikane Innovations</span>
                                  </td>
                                </tr>
                              </table>
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
                                  %s
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
                """.formatted(safeLogoUrl, safeName, safeId, safeDept, safeRole, resumeRow);
    }

    String buildAdminContactAlertHtml(ContactSubmission sub) {
        String safeName = escapeHtml(sub.getName());
        String safeEmail = escapeHtml(sub.getEmail());
        String safePhone = escapeHtml(sub.getPhone() != null ? sub.getPhone() : "Not provided");
        String safeCompany = escapeHtml(sub.getCompany() != null ? sub.getCompany() : "Not provided");
        String safeMessage = escapeHtml(sub.getMessage()).replace("\n", "<br/>");
        String timeStr = sub.getCreatedAt() != null ? sub.getCreatedAt().toString() : "Just now";
        String safeLogoUrl = escapeHtml(getLogoUrl());

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head><meta charset="UTF-8"><title>New Contact Enquiry</title></head>
                <body style="margin: 0; padding: 24px; background-color: #0b1523; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #001224; border: 1px solid #00E5FF33; border-radius: 12px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px; width: 36px;">
                          <img src="%s" alt="Omoikane Innovations" width="36" height="36" border="0" style="display: block; width: 36px; height: 36px; max-width: 36px; max-height: 36px; border: 0; outline: none; text-decoration: none;" />
                        </td>
                        <td style="vertical-align: middle;">
                          <span style="color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Omoikane Innovations</span>
                        </td>
                      </tr>
                    </table>
                    <div style="display: flex; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 24px;">
                      <h2 style="margin: 0; color: #00E5FF; font-size: 20px; letter-spacing: 0.5px;">New Contact Enquiry Received</h2>
                    </div>
                    <table width="100%%" cellpadding="8" cellspacing="0" style="font-size: 14px; margin-bottom: 24px; border-collapse: collapse;">
                      <tr style="border-bottom: 1px solid #1e293b;">
                        <td style="color: #94a3b8; width: 120px; font-weight: 600;">Name:</td>
                        <td style="color: #ffffff; font-weight: 600;">%s</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #1e293b;">
                        <td style="color: #94a3b8; font-weight: 600;">Email:</td>
                        <td><a href="mailto:%s" style="color: #38bdf8; text-decoration: none;">%s</a></td>
                      </tr>
                      <tr style="border-bottom: 1px solid #1e293b;">
                        <td style="color: #94a3b8; font-weight: 600;">Phone:</td>
                        <td style="color: #e2e8f0;">%s</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #1e293b;">
                        <td style="color: #94a3b8; font-weight: 600;">Company:</td>
                        <td style="color: #e2e8f0;">%s</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #1e293b;">
                        <td style="color: #94a3b8; font-weight: 600;">Received:</td>
                        <td style="color: #64748b; font-size: 13px;">%s</td>
                      </tr>
                    </table>
                    <div style="background-color: #0b1523; border: 1px solid #1e293b; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                      <div style="font-size: 12px; font-weight: 600; color: #38bdf8; text-transform: uppercase; margin-bottom: 8px;">Message:</div>
                      <div style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">%s</div>
                    </div>
                    <div style="text-align: center; margin-top: 24px;">
                      <a href="%s" style="display: inline-block; background-color: #0070F3; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600;">Open Admin Dashboard</a>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(safeLogoUrl, safeName, safeEmail, safeEmail, safePhone, safeCompany, timeStr, safeMessage, escapeHtml(adminDashboardUrl));
    }

    String buildAdminCareerAlertHtml(CareerApplication app) {
        String safeName = escapeHtml(app.getName());
        String safeEmail = escapeHtml(app.getEmail());
        String safePhone = escapeHtml(app.getPhone() != null ? app.getPhone() : "Not provided");
        String safeDept = escapeHtml(formatDepartment(app.getDepartment()));
        String safeRole = escapeHtml(app.getRoleTitle() != null ? app.getRoleTitle() : app.getRoleId());
        String safeFilename = escapeHtml(app.getResumeFilename() != null ? app.getResumeFilename() : "resume.pdf");
        String safeMessage = escapeHtml(app.getMessage() != null ? app.getMessage() : "").replace("\n", "<br/>");
        String timeStr = app.getCreatedAt() != null ? app.getCreatedAt().toString() : "Just now";
        String safeLogoUrl = escapeHtml(getLogoUrl());

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head><meta charset="UTF-8"><title>New Job Application</title></head>
                <body style="margin: 0; padding: 24px; background-color: #0b1523; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #001224; border: 1px solid #00E5FF33; border-radius: 12px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px; width: 36px;">
                          <img src="%s" alt="Omoikane Innovations" width="36" height="36" border="0" style="display: block; width: 36px; height: 36px; max-width: 36px; max-height: 36px; border: 0; outline: none; text-decoration: none;" />
                        </td>
                        <td style="vertical-align: middle;">
                          <span style="color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Omoikane Innovations</span>
                        </td>
                      </tr>
                    </table>

                    <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 24px;">
                      <h2 style="margin: 0; color: #00E5FF; font-size: 20px; letter-spacing: 0.5px;">New Job Application Received</h2>
                    </div>
                    <table width="100%%" cellpadding="8" cellspacing="0" style="font-size: 14px; margin-bottom: 24px; border-collapse: collapse;">
                      <tr style="border-bottom: 1px solid #1e293b;">
                        <td style="color: #94a3b8; width: 120px; font-weight: 600;">Applicant:</td>
                        <td style="color: #ffffff; font-weight: 600;">%s</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #1e293b;">
                        <td style="color: #94a3b8; font-weight: 600;">Email:</td>
                        <td><a href="mailto:%s" style="color: #38bdf8; text-decoration: none;">%s</a></td>
                      </tr>
                      <tr style="border-bottom: 1px solid #1e293b;">
                        <td style="color: #94a3b8; font-weight: 600;">Phone:</td>
                        <td style="color: #e2e8f0;">%s</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #1e293b;">
                        <td style="color: #94a3b8; font-weight: 600;">Position:</td>
                        <td style="color: #38bdf8; font-weight: 600;">%s (%s)</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #1e293b;">
                        <td style="color: #94a3b8; font-weight: 600;">Resume:</td>
                        <td style="color: #38bdf8; font-weight: 600;">&#128206; %s (Attached to this email)</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #1e293b;">
                        <td style="color: #94a3b8; font-weight: 600;">Applied At:</td>
                        <td style="color: #64748b; font-size: 13px;">%s</td>
                      </tr>
                    </table>
                    <div style="background-color: #0b1523; border: 1px solid #1e293b; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                      <div style="font-size: 12px; font-weight: 600; color: #38bdf8; text-transform: uppercase; margin-bottom: 8px;">Cover Letter:</div>
                      <div style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">%s</div>
                    </div>
                    <div style="text-align: center; margin-top: 24px;">
                      <a href="%s" style="display: inline-block; background-color: #0070F3; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600;">Review in Admin Dashboard</a>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(safeLogoUrl, safeName, safeEmail, safeEmail, safePhone, safeRole, safeDept, safeFilename, timeStr, safeMessage, escapeHtml(adminDashboardUrl));
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
