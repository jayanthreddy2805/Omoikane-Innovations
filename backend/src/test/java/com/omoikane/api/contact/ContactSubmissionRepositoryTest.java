package com.omoikane.api.contact;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class ContactSubmissionRepositoryTest {

    @Autowired
    private ContactSubmissionRepository repository;

    @Test
    void matchingEmailAndPhoneAreFoundBeforeSaving() {
        ContactSubmission submission = new ContactSubmission();
        submission.setName("Alice");
        submission.setEmail(" Alice@Example.COM ");
        submission.setPhone(" +1 555 0100 ");
        submission.setMessage("First enquiry");
        repository.saveAndFlush(submission);

        assertTrue(repository.existsByContactDetails("alice@example.com", "+1 555 0100"));
        assertFalse(repository.existsByContactDetails("alice@example.com", "+1 555 0101"));
    }

    @Test
    void missingPhoneOnlyMatchesMissingPhone() {
        ContactSubmission submission = new ContactSubmission();
        submission.setName("Bob");
        submission.setEmail("bob@example.com");
        submission.setMessage("First enquiry");
        repository.saveAndFlush(submission);

        assertTrue(repository.existsByContactDetails("bob@example.com", ""));
        assertFalse(repository.existsByContactDetails("bob@example.com", "+1 555 0100"));
    }
}
