package com.omoikane.api.dto;

import org.springframework.web.multipart.MultipartFile;

/**
 * DTO matching the careers application form fields.
 */
public class CareerApplicationRequest {

    private String name;
    private String email;
    private String phone;
    private String department;
    private String role;
    private String roleTitle;
    private String message;
    private MultipartFile resume;

    public CareerApplicationRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public MultipartFile getResume() { return resume; }
    public void setResume(MultipartFile resume) { this.resume = resume; }
}
