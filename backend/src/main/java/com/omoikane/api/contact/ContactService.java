package com.omoikane.api.contact;

import com.omoikane.api.email.ResendEmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactSubmissionRepository repository;
    private final ResendEmailService emailService;

    public ContactService(ContactSubmissionRepository repository,
                          ResendEmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    /**
     * Persists the contact submission, then attempts email delivery.
     * Email failure does NOT roll back the saved record.
     *
     * @return the saved entity
     */
    public ContactSubmission processContactRequest(ContactRequest request, String clientIp) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        String phone = request.getPhone() == null ? "" : request.getPhone().trim();
        if (repository.existsByContactDetails(email, phone)) {
            throw new DuplicateContactException();
        }

        ContactSubmission submission = new ContactSubmission();
        submission.setName(request.getName());
        submission.setEmail(email);
        submission.setCompany(request.getCompany());
        submission.setPhone(phone.isEmpty() ? null : phone);
        submission.setMessage(request.getMessage());
        submission.setClientIp(clientIp);

        // Save FIRST — before any email attempt
        try {
            // Flush before sending any email so a concurrent duplicate is rejected here.
            submission = repository.saveAndFlush(submission);
        } catch (DataIntegrityViolationException exception) {
            // Only translate a duplicate of these contact details. Other database
            // constraints must still surface as operational errors.
            if (repository.existsByContactDetails(email, phone)) {
                throw new DuplicateContactException();
            }
            throw exception;
        }
        log.info("Contact submission saved [id={}]", submission.getId());

        // Attempt confirmation email (fire-and-forget style)
        try {
            boolean sent = emailService.sendConfirmation(submission);
            if (sent) {
                submission.setEmailSent(true);
                repository.save(submission);
                log.info("Confirmation email sent for submission [id={}]", submission.getId());
            }
        } catch (Exception e) {
            log.warn("Email delivery failed for submission [id={}]: {}", submission.getId(), e.getMessage());
            // Record stays saved — email failure is non-fatal
        }

        // Notify admin/manager email
        try {
            emailService.sendAdminContactAlert(submission);
        } catch (Exception e) {
            log.warn("Admin notification email failed for submission [id={}]: {}", submission.getId(), e.getMessage());
        }

        return submission;
    }
}
