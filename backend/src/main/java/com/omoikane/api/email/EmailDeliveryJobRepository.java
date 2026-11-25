package com.omoikane.api.email;
import java.time.OffsetDateTime;
import java.util.List;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
public interface EmailDeliveryJobRepository extends JpaRepository<EmailDeliveryJob,Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints(@jakarta.persistence.QueryHint(name="jakarta.persistence.lock.timeout", value="-2"))
    @Query("select j from EmailDeliveryJob j where j.status in ('PENDING','PROCESSING') and j.nextAttemptAt <= :now order by j.nextAttemptAt, j.id")
    List<EmailDeliveryJob> findDue(@Param("now") OffsetDateTime now, Pageable limit);

    // A recovered lease belongs to a new attempt. A late worker must not finish it.
    @Modifying
    @Query("update EmailDeliveryJob j set j.status = :status, j.nextAttemptAt = :next where j.id = :id and j.attempts = :attempt and j.status = 'PROCESSING'")
    int finishClaim(@Param("id") Long id, @Param("attempt") int attempt,
                    @Param("status") String status, @Param("next") OffsetDateTime next);
}
