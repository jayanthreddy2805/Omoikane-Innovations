package com.omoikane.api.email;
import com.omoikane.api.contact.ContactSubmissionRepository;
import com.omoikane.api.careers.CareerApplicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.*;
import org.springframework.stereotype.Component;
@Component
@EnableScheduling
@ConditionalOnProperty(name="app.email.worker-enabled",havingValue="true",matchIfMissing=true)
public class EmailDeliveryWorker {
    private static final Logger log=LoggerFactory.getLogger(EmailDeliveryWorker.class);
    private final EmailOutbox outbox;
    private final ResendEmailService email;
    private final ContactSubmissionRepository contacts;
    private final CareerApplicationRepository careers;
    public EmailDeliveryWorker(EmailOutbox outbox,ResendEmailService email,ContactSubmissionRepository contacts,CareerApplicationRepository careers){this.outbox=outbox;this.email=email;this.contacts=contacts;this.careers=careers;}
    @Scheduled(fixedDelayString="${app.email.poll-ms:5000}",initialDelayString="${app.email.initial-delay-ms:10000}")
    public void poll(){
        if(!email.isConfigured())return; // Retain pending jobs until configuration is supplied.
        for(int i=0;i<4;i++){
            EmailDeliveryJob job=outbox.claim();if(job==null)return;
            try {outbox.finish(job.getId(),deliver(job)?"SENT":"SKIPPED",false);}
            catch(EmailDeliveryException exception){outbox.finish(job.getId(),"FAILED",true);log.warn("Email delivery deferred [jobId={}]",job.getId());}
            catch(Exception exception){outbox.finish(job.getId(),"FAILED",true);log.error("Email delivery failed [jobId={}, type={}]",job.getId(),exception.getClass().getSimpleName());}
        }
    }
    boolean deliver(EmailDeliveryJob job){
        if(job.getKind().startsWith("CONTACT_")){
            var found=contacts.findById(job.getSubmissionId());if(found.isEmpty())return false;
            var contact=found.get();
            if("CONTACT_CONFIRMATION".equals(job.getKind())){
                boolean sent=email.sendConfirmation(contact);
                if(sent){contact.setEmailSent(true);contacts.save(contact);}
                return sent;
            }
            return email.sendAdminContactAlert(contact);
        }
        var found=careers.findById(job.getSubmissionId());if(found.isEmpty())return false;
        return "CAREER_CONFIRMATION".equals(job.getKind())?email.sendCareerConfirmation(found.get()):email.sendAdminCareerAlert(found.get());
    }
}
