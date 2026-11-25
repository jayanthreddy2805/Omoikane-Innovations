package com.omoikane.api.email;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.*;
@Service
public class EmailOutbox {
    private final EmailDeliveryJobRepository jobs;
    public EmailOutbox(EmailDeliveryJobRepository jobs){this.jobs=jobs;}
    @Transactional(propagation=Propagation.MANDATORY)
    public void enqueueContact(Long id){jobs.saveAll(List.of(new EmailDeliveryJob("CONTACT_CONFIRMATION",id),new EmailDeliveryJob("CONTACT_ADMIN",id)));}
    @Transactional(propagation=Propagation.MANDATORY)
    public void enqueueCareer(Long id){jobs.saveAll(List.of(new EmailDeliveryJob("CAREER_CONFIRMATION",id),new EmailDeliveryJob("CAREER_ADMIN",id)));}
    @Transactional(propagation=Propagation.REQUIRES_NEW)
    public EmailDeliveryJob claim(){
        var due=jobs.findDue(OffsetDateTime.now(),PageRequest.of(0,1));
        if(due.isEmpty())return null;
        var job=due.getFirst();
        if(job.getAttempts()>=4){job.finish("FAILED");jobs.saveAndFlush(job);return null;}
        job.claim();return jobs.saveAndFlush(job);
    }
    @Transactional(propagation=Propagation.REQUIRES_NEW)
    public void finish(EmailDeliveryJob claim,String status,boolean retryable){
        boolean retry=retryable && claim.getAttempts()<4;
        var next=retry?OffsetDateTime.now().plusSeconds(Math.min(300,5L << Math.min(claim.getAttempts(),5))):claim.getNextAttemptAt();
        jobs.finishClaim(claim.getId(),claim.getAttempts(),retry?"PENDING":status,next);
    }
}
