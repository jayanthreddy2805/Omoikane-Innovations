package com.omoikane.api.careers;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerApplicationRepository extends JpaRepository<CareerApplication, Long> {
    @Query(value = """
        select id, name, email, phone, department, role_id as "roleId", role_title as "roleTitle",
               message, resume_filename as "resumeFilename", resume_content_type as "resumeContentType",
               octet_length(resume_data) as "resumeSize", status, created_at as "createdAt"
          from career_applications order by created_at desc, id desc
        """, nativeQuery = true)
    List<CareerApplicationListItem> findApplicationSummaries();
}
