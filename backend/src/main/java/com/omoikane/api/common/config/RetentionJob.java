package com.omoikane.api.common.config;

import java.time.OffsetDateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@EnableScheduling
@ConditionalOnProperty(name = "app.retention.enabled", havingValue = "true")
public class RetentionJob {
    private final JdbcTemplate jdbc;
    private final int contactDays;
    private final int applicationDays;
    public RetentionJob(JdbcTemplate jdbc,
            @Value("${app.retention.contact-days}") int contactDays,
            @Value("${app.retention.application-days}") int applicationDays) {
        if (contactDays < 1 || applicationDays < 1) throw new IllegalArgumentException("Retention periods must be positive");
        this.jdbc = jdbc; this.contactDays = contactDays; this.applicationDays = applicationDays;
    }
    @Scheduled(cron = "${app.retention.cron:0 0 2 * * *}", zone = "UTC")
    @Transactional
    public void purgeExpired() {
        jdbc.update("DELETE FROM contact_submissions WHERE created_at < ?", OffsetDateTime.now().minusDays(contactDays));
        jdbc.update("DELETE FROM career_applications WHERE created_at < ?", OffsetDateTime.now().minusDays(applicationDays));
    }
}
