package com.omoikane.api.careers;
import java.time.OffsetDateTime;
public interface CareerApplicationListItem {
    Long getId();
    String getName();
    String getEmail();
    String getPhone();
    String getDepartment();
    String getRoleId();
    String getRoleTitle();
    String getMessage();
    String getResumeFilename();
    String getResumeContentType();
    long getResumeSize();
    String getStatus();
    OffsetDateTime getCreatedAt();
}
