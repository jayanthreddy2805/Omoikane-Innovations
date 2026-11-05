package com.omoikane.api.contact;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, Long> {
    List<ContactSubmission> findAllByOrderByCreatedAtDesc();
}
