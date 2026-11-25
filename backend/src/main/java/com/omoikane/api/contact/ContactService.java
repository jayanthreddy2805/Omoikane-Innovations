package com.omoikane.api.contact;

import com.omoikane.api.email.EmailOutbox;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactSubmissionRepository repository;
    private final EmailOutbox emailOutbox;

    public ContactService(ContactSubmissionRepository repository,
                          EmailOutbox emailOutbox) {
        this.repository = repository;
        this.emailOutbox = emailOutbox;
    }

    /**
     * Persists the contact submission and email jobs atomically.
     * Delivery happens in the background after this transaction commits.
     *
     * @return the saved entity
     */
    @Transactional
    public ContactSubmission processContactRequest(ContactRequest request, String clientIp) {
        if (request.getWebsite() != null && !request.getWebsite().isBlank()) throw new IllegalArgumentException("Invalid submission.");
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
            if (exception.getMostSpecificCause().getMessage() != null && exception.getMostSpecificCause().getMessage().contains("uq_contact_submissions_contact_details")) {
                throw new DuplicateContactException();
            }
            throw exception;
        }
        log.info("Contact submission saved [id={}]", submission.getId());

        emailOutbox.enqueueContact(submission.getId());

        return submission;
    }
}
