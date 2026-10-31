package com.omoikane.api.service;

import com.omoikane.api.dto.ContactRequest;
import com.omoikane.api.entity.ContactSubmission;
import com.omoikane.api.repository.ContactSubmissionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

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
        ContactSubmission submission = new ContactSubmission();
        submission.setName(request.getName());
        submission.setEmail(request.getEmail());
        submission.setCompany(request.getCompany());
        submission.setPhone(request.getPhone());
        submission.setMessage(request.getMessage());
        submission.setClientIp(clientIp);

        // Save FIRST — before any email attempt
        submission = repository.save(submission);
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

        return submission;
    }
}
