package com.omoikane.api.service;

import com.omoikane.api.dto.CareerApplicationRequest;
import com.omoikane.api.entity.CareerApplication;
import com.omoikane.api.repository.CareerApplicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class CareerApplicationService {

    private static final Logger log = LoggerFactory.getLogger(CareerApplicationService.class);

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    // Allowed departments and roles matching frontend ApplyForm.jsx
    private static final Map<String, Map<String, String>> VALID_ROLES_BY_DEPT = new HashMap<>();

    static {
        Map<String, String> software = new HashMap<>();
        software.put("web-dev", "Web Developer");
        software.put("python-dev", "Python Developer");
        software.put("ai-dev", "AI Developer");
        software.put("firmware-eng", "Embedded Firmware");
        software.put("other", "Other");
        VALID_ROLES_BY_DEPT.put("software", software);

        Map<String, String> mechanical = new HashMap<>();
        mechanical.put("mech-design", "3D & 2D Mechanical Design");
        mechanical.put("mech-assembly", "Mechanical Assembly & Integration");
        mechanical.put("struct-therm", "Structural & Thermal Analysis");
        mechanical.put("prod-eng", "Product Engineering");
        mechanical.put("other", "Other");
        VALID_ROLES_BY_DEPT.put("mechanical", mechanical);

        Map<String, String> electronics = new HashMap<>();
        electronics.put("hardware-eng", "Hardware System Design");
        electronics.put("pcb-eng", "PCB Layout & Routing");
        electronics.put("rf-eng", "RF & Communications");
        electronics.put("test-eng", "Testing & Integration");
        electronics.put("other", "Other");
        VALID_ROLES_BY_DEPT.put("electronics", electronics);
    }

    private final CareerApplicationRepository repository;
    private final ResendEmailService emailService;

    @Autowired
    public CareerApplicationService(CareerApplicationRepository repository, ResendEmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    public CareerApplicationService(CareerApplicationRepository repository) {
        this(repository, null);
    }

    @Transactional
    public CareerApplication processApplication(CareerApplicationRequest request) throws IOException {
        validateRequest(request);

        MultipartFile file = request.getResume();
        validateResumeFile(file);

        // Resolve department if omitted or fallback to lookup
        String dept = request.getDepartment() != null ? request.getDepartment().trim().toLowerCase() : "";
        String roleId = request.getRole() != null ? request.getRole().trim().toLowerCase() : "";

        // If department is missing, find it from the unique roleId
        if (dept.isEmpty() || !VALID_ROLES_BY_DEPT.containsKey(dept)) {
            dept = findDepartmentForRole(roleId);
        }

        String roleTitle = resolveRoleTitle(dept, roleId, request.getRoleTitle());

        CareerApplication application = new CareerApplication();
        application.setName(request.getName().trim());
        application.setEmail(request.getEmail().trim());
        application.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        application.setDepartment(dept);
        application.setRoleId(roleId);
        application.setRoleTitle(roleTitle);
        application.setMessage(request.getMessage().trim());

        String originalFilename = file.getOriginalFilename();
        application.setResumeFilename(originalFilename != null ? originalFilename : "resume");
        application.setResumeContentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        application.setResumeData(file.getBytes());
        application.setStatus("PENDING");

        CareerApplication saved = repository.save(application);
        log.info("Career application saved successfully [id={}, roleId={}]", saved.getId(), saved.getRoleId());

        if (emailService != null) {
            try {
                emailService.sendCareerConfirmation(saved);
            } catch (Exception e) {
                log.warn("Email delivery failed for career application [id={}]: {}", saved.getId(), e.getMessage());
            }
        }

        return saved;
    }

    private void validateRequest(CareerApplicationRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (!EMAIL_PATTERN.matcher(request.getEmail().trim()).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("Cover letter / message is required");
        }

        String roleId = request.getRole() != null ? request.getRole().trim().toLowerCase() : "";
        if (roleId.isEmpty()) {
            throw new IllegalArgumentException("Role is required");
        }

        String dept = request.getDepartment() != null ? request.getDepartment().trim().toLowerCase() : "";
        if (!dept.isEmpty()) {
            if (!VALID_ROLES_BY_DEPT.containsKey(dept)) {
                throw new IllegalArgumentException("Invalid department: " + dept);
            }
            if (!VALID_ROLES_BY_DEPT.get(dept).containsKey(roleId)) {
                throw new IllegalArgumentException("Invalid role '" + roleId + "' for department '" + dept + "'");
            }
        } else {
            // Check if roleId belongs to any known department
            if (findDepartmentForRole(roleId) == null) {
                throw new IllegalArgumentException("Invalid role: " + roleId);
            }
        }
    }

    private String findDepartmentForRole(String roleId) {
        for (Map.Entry<String, Map<String, String>> entry : VALID_ROLES_BY_DEPT.entrySet()) {
            if (entry.getValue().containsKey(roleId)) {
                return entry.getKey();
            }
        }
        return null;
    }

    private String resolveRoleTitle(String dept, String roleId, String providedTitle) {
        if (providedTitle != null && !providedTitle.trim().isEmpty()) {
            return providedTitle.trim();
        }
        if (dept != null && VALID_ROLES_BY_DEPT.containsKey(dept)) {
            return VALID_ROLES_BY_DEPT.get(dept).get(roleId);
        }
        return roleId;
    }

    private void validateResumeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Resume file is required");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File exceeds maximum size of 5 MB.");
        }

        String filename = file.getOriginalFilename();
        if (filename == null || !filename.contains(".")) {
            throw new IllegalArgumentException("Resume must have a valid file extension (.pdf, .doc, .docx)");
        }

        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        if (!Arrays.asList("pdf", "doc", "docx").contains(ext)) {
            throw new IllegalArgumentException("Please upload a valid PDF or Word document (.pdf, .doc, .docx)");
        }

        byte[] header = new byte[8];
        try (var is = file.getInputStream()) {
            int read = is.read(header);
            if (read < 4) {
                throw new IllegalArgumentException("File is empty or corrupted");
            }
        }

        // Validate magic numbers to reject disguised files
        if ("pdf".equals(ext)) {
            // PDF starts with %PDF (0x25 0x50 0x44 0x46)
            if (!(header[0] == 0x25 && header[1] == 0x50 && header[2] == 0x44 && header[3] == 0x46)) {
                throw new IllegalArgumentException("Invalid PDF file content");
            }
        } else if ("docx".equals(ext)) {
            // DOCX is a zip file starting with PK\x03\x04 (0x50 0x4B 0x03 0x04)
            if (!(header[0] == 0x50 && header[1] == 0x4B && header[2] == 0x03 && header[3] == 0x04)) {
                throw new IllegalArgumentException("Invalid DOCX file content");
            }
        } else if ("doc".equals(ext)) {
            // DOC (Compound File Binary Format) starts with 0xD0 0xCF 0x11 0xE0
            if (!(header[0] == (byte) 0xD0 && header[1] == (byte) 0xCF && header[2] == 0x11 && header[3] == (byte) 0xE0)) {
                throw new IllegalArgumentException("Invalid DOC file content");
            }
        }
    }
}
