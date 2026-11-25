package com.omoikane.api.common.config;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import java.time.OffsetDateTime;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
class RetentionJobTest {
    @Test void rejectsMissingPolicyPeriods() {
        assertThrows(IllegalArgumentException.class, () -> new RetentionJob(mock(JdbcTemplate.class), 0, 365));
    }
    @Test void usesIndependentAgeCutoffs() {
        JdbcTemplate jdbc = mock(JdbcTemplate.class);
        OffsetDateTime before = OffsetDateTime.now();
        new RetentionJob(jdbc, 30, 90).purgeExpired();
        verify(jdbc).update(eq("DELETE FROM contact_submissions WHERE created_at < ?"), argThat((OffsetDateTime date) -> !date.isBefore(before.minusDays(30)) && date.isBefore(before.minusDays(29))));
        verify(jdbc).update(eq("DELETE FROM career_applications WHERE created_at < ?"), argThat((OffsetDateTime date) -> !date.isBefore(before.minusDays(90)) && date.isBefore(before.minusDays(89))));
        verifyNoMoreInteractions(jdbc);
    }
}
