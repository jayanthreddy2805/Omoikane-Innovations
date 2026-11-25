package com.omoikane.api.contact;

import com.omoikane.api.email.EmailOutbox;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private ContactSubmissionRepository repository;

    @Mock
    private EmailOutbox emailOutbox;

    private ContactService contactService;

    @BeforeEach
    void setUp() {
        contactService = new ContactService(repository, emailOutbox);
    }

    @Test
    void invalidPhoneCannotReachPersistenceOrEmailOutbox() {
        ContactRequest request = new ContactRequest();
        request.setPhone("not a number");
        assertThrows(IllegalArgumentException.class, () -> contactService.processContactRequest(request, "127.0.0.1"));
        verifyNoInteractions(repository, emailOutbox);
    }

    @Test
    void processContactRequest_savesRecord() {
        ContactRequest req = new ContactRequest();
        req.setName("Alice");
        req.setEmail("alice@example.com");
        req.setMessage("Hello world");

        when(repository.saveAndFlush(any(ContactSubmission.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        ContactSubmission result = contactService.processContactRequest(req, "127.0.0.1");

        assertNotNull(result);
        assertEquals("Alice", result.getName());
        assertEquals("alice@example.com", result.getEmail());
        assertEquals("Hello world", result.getMessage());
        assertEquals("127.0.0.1", result.getClientIp());

        verify(repository).saveAndFlush(any(ContactSubmission.class));
    }

    @Test
    void processContactRequest_enqueuesAfterSaving() {
        ContactRequest req=new ContactRequest();req.setName("Alice");req.setEmail("alice@example.com");req.setMessage("Hello");
        when(repository.saveAndFlush(any())).thenAnswer(inv -> {
            ContactSubmission contact=inv.getArgument(0);
            var field=ContactSubmission.class.getDeclaredField("id");field.setAccessible(true);field.set(contact,123L);return contact;
        });
        contactService.processContactRequest(req,"127.0.0.1");
        var order=inOrder(repository,emailOutbox);
        order.verify(repository).existsByContactDetails("alice@example.com","");
        order.verify(repository).saveAndFlush(any());order.verify(emailOutbox).enqueueContact(123L);
    }

    @Test
    void processContactRequest_capturesOptionalFields() {
        ContactRequest req = new ContactRequest();
        req.setName("Dave");
        req.setEmail("dave@example.com");
        req.setCompany("Acme");
        req.setPhone("+1234567890");
        req.setMessage("Enquiry");

        when(repository.saveAndFlush(any(ContactSubmission.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        ContactSubmission result = contactService.processContactRequest(req, "10.0.0.2");

        assertEquals("Acme", result.getCompany());
        assertEquals("+1234567890", result.getPhone());
    }

    @Test
    void matchingEmailAndPhone_doesNotSaveOrSendEmail() {
        ContactRequest req = new ContactRequest();
        req.setName("Alice");
        req.setEmail("  ALICE@example.com ");
        req.setPhone(" +1 555 0100 ");
        req.setMessage("Another enquiry");
        when(repository.existsByContactDetails("alice@example.com", "+1 555 0100")).thenReturn(true);

        assertThrows(DuplicateContactException.class, () -> contactService.processContactRequest(req, "127.0.0.1"));
        verify(repository, never()).saveAndFlush(any());
        verifyNoInteractions(emailOutbox);
    }

    @Test
    void sameEmailWithDifferentPhone_canSubmit() {
        ContactRequest req = new ContactRequest();
        req.setName("Alice");
        req.setEmail(" Alice@EXAMPLE.COM ");
        req.setPhone("+1 555 0101");
        req.setMessage("Enquiry");
        when(repository.saveAndFlush(any(ContactSubmission.class))).thenAnswer(inv -> inv.getArgument(0));

        ContactSubmission saved = contactService.processContactRequest(req, "127.0.0.1");

        verify(repository).existsByContactDetails("alice@example.com", "+1 555 0101");
        assertEquals("alice@example.com", saved.getEmail());
        assertEquals("+1 555 0101", saved.getPhone());
    }

    @Test
    void concurrentDuplicateRejectedBeforeAnyEmailIsSent() {
        ContactRequest req = new ContactRequest();
        req.setName("Alice");
        req.setEmail(" Alice@Example.com ");
        req.setPhone(" +1 555 0100 ");
        req.setMessage("Enquiry");
        when(repository.saveAndFlush(any(ContactSubmission.class)))
                .thenThrow(new DataIntegrityViolationException("uq_contact_submissions_contact_details"));
        when(repository.existsByContactDetails("alice@example.com", "+1 555 0100"))
                .thenReturn(false);

        assertThrows(DuplicateContactException.class, () -> contactService.processContactRequest(req, "127.0.0.1"));
        verifyNoInteractions(emailOutbox);
    }

    @Test
    void unrelatedDatabaseConstraintIsNotReportedAsDuplicate() {
        ContactRequest req = new ContactRequest();
        req.setName("Alice");
        req.setEmail("alice@example.com");
        req.setMessage("Enquiry");
        when(repository.saveAndFlush(any(ContactSubmission.class)))
                .thenThrow(new DataIntegrityViolationException("database unavailable"));

        assertThrows(DataIntegrityViolationException.class,
                () -> contactService.processContactRequest(req, "127.0.0.1"));
        verifyNoInteractions(emailOutbox);
    }
}
