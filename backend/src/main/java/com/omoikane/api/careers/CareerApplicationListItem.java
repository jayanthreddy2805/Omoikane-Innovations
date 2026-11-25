package com.omoikane.api.careers;
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
    // Native TIMESTAMPTZ is Instant on PostgreSQL and OffsetDateTime on H2.
    Object getCreatedAt();
}
