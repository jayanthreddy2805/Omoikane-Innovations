package com.omoikane.api.service;

import com.omoikane.api.dto.SubscriptionRequest;
import com.omoikane.api.entity.EmailSubscriber;
import com.omoikane.api.repository.EmailSubscriberRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.UUID;

@Service
public class EmailSubscriptionService {

    public enum Result {
        CREATED,
        ALREADY_ACTIVE,
        REACTIVATED
    }

    private static final Logger log = LoggerFactory.getLogger(EmailSubscriptionService.class);

    private final EmailSubscriberRepository repository;

    public EmailSubscriptionService(EmailSubscriberRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Result subscribe(SubscriptionRequest request, String clientIp) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        return repository.findByEmailIgnoreCase(normalizedEmail)
                .map(existing -> reactivateIfRequired(existing, clientIp))
                .orElseGet(() -> createSubscriber(normalizedEmail, clientIp));
    }

    @Transactional
    public boolean unsubscribe(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }

        return repository.findByUnsubscribeToken(token.trim())
                .map(subscriber -> {
                    if (subscriber.getStatus() == EmailSubscriber.Status.UNSUBSCRIBED) {
                        return true;
                    }

                    subscriber.setStatus(EmailSubscriber.Status.UNSUBSCRIBED);
                    subscriber.setUnsubscribedAt(OffsetDateTime.now());
                    repository.save(subscriber);
                    log.info("Email subscription disabled [id={}]", subscriber.getId());
                    return true;
                })
                .orElse(false);
    }

    private Result createSubscriber(String email, String clientIp) {
        EmailSubscriber subscriber = new EmailSubscriber();
        subscriber.setEmail(email);
        subscriber.setClientIp(clientIp);
        subscriber.setStatus(EmailSubscriber.Status.ACTIVE);
        subscriber.setConsentGivenAt(OffsetDateTime.now());
        subscriber.setUnsubscribeToken(newUnsubscribeToken());
        repository.save(subscriber);
        log.info("Email subscription saved [id={}]", subscriber.getId());
        return Result.CREATED;
    }

    private Result reactivateIfRequired(EmailSubscriber subscriber, String clientIp) {
        if (subscriber.getStatus() == EmailSubscriber.Status.ACTIVE) {
            return Result.ALREADY_ACTIVE;
        }

        subscriber.setStatus(EmailSubscriber.Status.ACTIVE);
        subscriber.setConsentGivenAt(OffsetDateTime.now());
        subscriber.setUnsubscribedAt(null);
        subscriber.setUnsubscribeToken(newUnsubscribeToken());
        subscriber.setClientIp(clientIp);
        repository.save(subscriber);
        log.info("Email subscription reactivated [id={}]", subscriber.getId());
        return Result.REACTIVATED;
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String newUnsubscribeToken() {
        return UUID.randomUUID().toString().replace("-", "")
                + UUID.randomUUID().toString().replace("-", "");
    }
}
