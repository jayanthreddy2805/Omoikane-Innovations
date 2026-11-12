package com.omoikane.api.contact;

import com.omoikane.api.email.ResendEmailService;
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
    private ResendEmailService emailService;

    private ContactService contactService;

    @BeforeEach
    void setUp() {
        contactService = new ContactService(repository, emailService);
    }

    @Test
    void processContactRequest_savesRecord() {
        ContactRequest req = new ContactRequest();
        req.setName("Alice");
        req.setEmail("alice@example.com");
        req.setMessage("Hello world");

        when(repository.saveAndFlush(any(ContactSubmission.class)))
                .thenAnswer(inv -> inv.getArgument(0));
        when(emailService.sendConfirmation(any())).thenReturn(false);

        ContactSubmission result = contactService.processContactRequest(req, "127.0.0.1");

        assertNotNull(result);
        assertEquals("Alice", result.getName());
        assertEquals("alice@example.com", result.getEmail());
        assertEquals("Hello world", result.getMessage());
        assertEquals("127.0.0.1", result.getClientIp());

        verify(repository).saveAndFlush(any(ContactSubmission.class));
    }

    @Test
    void processContactRequest_emailSuccess_setsFlag() {
        ContactRequest req = new ContactRequest();
        req.setName("Bob");
        req.setEmail("bob@example.com");
        req.setMessage("Test");

        when(repository.saveAndFlush(any(ContactSubmission.class)))
                .thenAnswer(inv -> inv.getArgument(0));
        when(emailService.sendConfirmation(any())).thenReturn(true);

        ContactSubmission result = contactService.processContactRequest(req, "10.0.0.1");

        assertTrue(result.isEmailSent());
        verify(repository).saveAndFlush(any(ContactSubmission.class));
        verify(repository).save(any(ContactSubmission.class));
    }

    @Test
    void processContactRequest_emailFailure_preservesRecord() {
        ContactRequest req = new ContactRequest();
        req.setName("Carol");
        req.setEmail("carol@example.com");
        req.setMessage("Test");

        when(repository.saveAndFlush(any(ContactSubmission.class)))
                .thenAnswer(inv -> inv.getArgument(0));
        when(emailService.sendConfirmation(any()))
                .thenThrow(new RuntimeException("SMTP timeout"));

        ContactSubmission result = contactService.processContactRequest(req, "192.168.1.1");

        assertNotNull(result);
        assertEquals("Carol", result.getName());
        assertFalse(result.isEmailSent());
        verify(repository).saveAndFlush(any(ContactSubmission.class));
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
        when(emailService.sendConfirmation(any())).thenReturn(false);

        ContactSubmission result = contactService.processContactRequest(req, "10.0.0.2");

        assertEquals("Acme", result.getCompany());
        assertEquals("+1234567890", result.getPhone());
    }

    @Test
    void processContactRequest_sendsEmailToSubmittedAddress() {
        ContactRequest req = new ContactRequest();
        req.setName("Contact Submitter");
        req.setEmail("submitter@example.com");
        req.setMessage("Enquiry message");

        when(repository.saveAndFlush(any(ContactSubmission.class)))
                .thenAnswer(inv -> inv.getArgument(0));
        when(emailService.sendConfirmation(any())).thenReturn(true);

        contactService.processContactRequest(req, "10.0.0.3");

        verify(emailService, times(1)).sendConfirmation(argThat(sub ->
                sub != null
                        && "submitter@example.com".equals(sub.getEmail())
                        && "Contact Submitter".equals(sub.getName())
        ));
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
        verifyNoInteractions(emailService);
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
                .thenThrow(new DataIntegrityViolationException("unique contact details"));
        when(repository.existsByContactDetails("alice@example.com", "+1 555 0100"))
                .thenReturn(false, true);

        assertThrows(DuplicateContactException.class, () -> contactService.processContactRequest(req, "127.0.0.1"));
        verifyNoInteractions(emailService);
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
        verifyNoInteractions(emailService);
    }
}
