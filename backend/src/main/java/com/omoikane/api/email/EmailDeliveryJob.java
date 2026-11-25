package com.omoikane.api.email;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
@Entity
@Table(name="email_delivery_jobs", uniqueConstraints=@UniqueConstraint(columnNames={"kind", "submission_id"}))
public class EmailDeliveryJob {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,length=32) private String kind;
    @Column(name="submission_id",nullable=false) private Long submissionId;
    @Column(nullable=false,length=16) private String status="PENDING";
    @Column(nullable=false) private int attempts;
    @Column(name="next_attempt_at",nullable=false) private OffsetDateTime nextAttemptAt=OffsetDateTime.now();
    @Column(name="created_at",nullable=false) private OffsetDateTime createdAt=OffsetDateTime.now();
    public EmailDeliveryJob() {}
    public EmailDeliveryJob(String kind, Long submissionId) { this.kind=kind; this.submissionId=submissionId; }
    public Long getId(){return id;} public String getKind(){return kind;} public Long getSubmissionId(){return submissionId;}
    public String getStatus(){return status;} public int getAttempts(){return attempts;}
    public OffsetDateTime getNextAttemptAt(){return nextAttemptAt;}
    public void claim(){status="PROCESSING"; attempts++; nextAttemptAt=OffsetDateTime.now().plusMinutes(5);}
    public void finish(String value){status=value;}
    public void retry(){status="PENDING"; nextAttemptAt=OffsetDateTime.now().plusSeconds(Math.min(300, 5L << Math.min(attempts, 5)));}
}
