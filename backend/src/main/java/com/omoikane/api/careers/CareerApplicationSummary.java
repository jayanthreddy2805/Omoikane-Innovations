package com.omoikane.api.careers;

import java.time.OffsetDateTime;

/**
 * Lightweight projection/DTO for career applications in the admin dashboard.
 * Excludes the binary bytea resume payload for high-performance listing.
 */
public class CareerApplicationSummary {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String department;
    private String roleId;
    private String roleTitle;
    private String message;
    private String resumeFilename;
    private String resumeContentType;
    private long resumeSize;
    private String status;
    private OffsetDateTime createdAt;

    public CareerApplicationSummary() {}

    public static CareerApplicationSummary fromEntity(CareerApplication entity) {
        CareerApplicationSummary dto = new CareerApplicationSummary();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setDepartment(entity.getDepartment());
        dto.setRoleId(entity.getRoleId());
        dto.setRoleTitle(entity.getRoleTitle());
        dto.setMessage(entity.getMessage());
        dto.setResumeFilename(entity.getResumeFilename());
        dto.setResumeContentType(entity.getResumeContentType());
        dto.setResumeSize(entity.getResumeData() != null ? entity.getResumeData().length : 0);
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }

    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getResumeFilename() { return resumeFilename; }
    public void setResumeFilename(String resumeFilename) { this.resumeFilename = resumeFilename; }

    public String getResumeContentType() { return resumeContentType; }
    public void setResumeContentType(String resumeContentType) { this.resumeContentType = resumeContentType; }

    public long getResumeSize() { return resumeSize; }
    public void setResumeSize(long resumeSize) { this.resumeSize = resumeSize; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
