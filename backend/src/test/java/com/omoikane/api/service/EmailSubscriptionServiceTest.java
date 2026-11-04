package com.omoikane.api.service;

import com.omoikane.api.dto.SubscriptionRequest;
import com.omoikane.api.entity.EmailSubscriber;
import com.omoikane.api.repository.EmailSubscriberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailSubscriptionServiceTest {

    @Mock
    private EmailSubscriberRepository repository;

    private EmailSubscriptionService service;

    @BeforeEach
    void setUp() {
        service = new EmailSubscriptionService(repository);
    }

    @Test
    void subscribe_normalizesAndSavesNewEmail() {
        SubscriptionRequest request = request("  Person@Example.COM  ");
        when(repository.findByEmailIgnoreCase("person@example.com")).thenReturn(Optional.empty());
        when(repository.save(any(EmailSubscriber.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmailSubscriptionService.Result result = service.subscribe(request, "127.0.0.1");

        assertEquals(EmailSubscriptionService.Result.CREATED, result);
        verify(repository).save(argThat(subscriber ->
                "person@example.com".equals(subscriber.getEmail())
                        && subscriber.getStatus() == EmailSubscriber.Status.ACTIVE
                        && "127.0.0.1".equals(subscriber.getClientIp())
                        && subscriber.getUnsubscribeToken() != null
                        && subscriber.getUnsubscribeToken().length() == 64
        ));
    }

    @Test
    void subscribe_returnsAlreadyActiveWithoutDuplicateSave() {
        SubscriptionRequest request = request("person@example.com");
        EmailSubscriber existing = subscriber("person@example.com", EmailSubscriber.Status.ACTIVE);
        when(repository.findByEmailIgnoreCase("person@example.com")).thenReturn(Optional.of(existing));

        EmailSubscriptionService.Result result = service.subscribe(request, "127.0.0.1");

        assertEquals(EmailSubscriptionService.Result.ALREADY_ACTIVE, result);
        verify(repository, never()).save(any());
    }

    @Test
    void subscribe_reactivatesUnsubscribedEmail() {
        SubscriptionRequest request = request("person@example.com");
        EmailSubscriber existing = subscriber("person@example.com", EmailSubscriber.Status.UNSUBSCRIBED);
        existing.setUnsubscribedAt(OffsetDateTime.now().minusDays(1));
        existing.setUnsubscribeToken("old-token");
        when(repository.findByEmailIgnoreCase("person@example.com")).thenReturn(Optional.of(existing));
        when(repository.save(any(EmailSubscriber.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmailSubscriptionService.Result result = service.subscribe(request, "192.0.2.10");

        assertEquals(EmailSubscriptionService.Result.REACTIVATED, result);
        assertEquals(EmailSubscriber.Status.ACTIVE, existing.getStatus());
        assertNull(existing.getUnsubscribedAt());
        assertNotEquals("old-token", existing.getUnsubscribeToken());
        verify(repository).save(existing);
    }

    @Test
    void unsubscribe_marksActiveSubscriberUnsubscribed() {
        EmailSubscriber existing = subscriber("person@example.com", EmailSubscriber.Status.ACTIVE);
        existing.setUnsubscribeToken("valid-token");
        when(repository.findByUnsubscribeToken("valid-token")).thenReturn(Optional.of(existing));
        when(repository.save(any(EmailSubscriber.class))).thenAnswer(invocation -> invocation.getArgument(0));

        boolean result = service.unsubscribe("valid-token");

        assertTrue(result);
        assertEquals(EmailSubscriber.Status.UNSUBSCRIBED, existing.getStatus());
        assertNotNull(existing.getUnsubscribedAt());
        verify(repository).save(existing);
    }

    @Test
    void unsubscribe_rejectsUnknownToken() {
        when(repository.findByUnsubscribeToken("unknown")).thenReturn(Optional.empty());

        assertFalse(service.unsubscribe("unknown"));
        verify(repository, never()).save(any());
    }

    private SubscriptionRequest request(String email) {
        SubscriptionRequest request = new SubscriptionRequest();
        request.setEmail(email);
        request.setConsent(true);
        return request;
    }

    private EmailSubscriber subscriber(String email, EmailSubscriber.Status status) {
        EmailSubscriber subscriber = new EmailSubscriber();
        subscriber.setEmail(email);
        subscriber.setStatus(status);
        subscriber.setConsentGivenAt(OffsetDateTime.now());
        subscriber.setUnsubscribeToken("initial-token");
        return subscriber;
    }
}
