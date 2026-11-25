package com.omoikane.api.email;
import java.time.OffsetDateTime;
import java.util.List;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
public interface EmailDeliveryJobRepository extends JpaRepository<EmailDeliveryJob,Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select j from EmailDeliveryJob j where j.status in ('PENDING','PROCESSING') and j.nextAttemptAt <= :now order by j.nextAttemptAt, j.id")
    List<EmailDeliveryJob> findDue(@Param("now") OffsetDateTime now, Pageable limit);
}
