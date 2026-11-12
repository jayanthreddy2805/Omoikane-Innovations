package com.omoikane.api.contact;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, Long> {
    List<ContactSubmission> findAllByOrderByCreatedAtDesc();

    @Query("select case when count(c) > 0 then true else false end from ContactSubmission c " +
            "where lower(trim(c.email)) = :email and coalesce(trim(c.phone), '') = :phone")
    boolean existsByContactDetails(@Param("email") String email, @Param("phone") String phone);
}
