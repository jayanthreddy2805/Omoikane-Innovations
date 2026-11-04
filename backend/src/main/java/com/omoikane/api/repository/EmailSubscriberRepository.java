package com.omoikane.api.repository;

import com.omoikane.api.entity.EmailSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmailSubscriberRepository extends JpaRepository<EmailSubscriber, Long> {
    Optional<EmailSubscriber> findByEmailIgnoreCase(String email);
    Optional<EmailSubscriber> findByUnsubscribeToken(String unsubscribeToken);
    List<EmailSubscriber> findAllByOrderByCreatedAtDesc();
}
