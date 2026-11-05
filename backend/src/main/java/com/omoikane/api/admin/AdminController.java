package com.omoikane.api.admin;

import com.omoikane.api.careers.CareerApplicationSummary;
import com.omoikane.api.careers.CareerApplication;
import com.omoikane.api.contact.ContactSubmission;
import com.omoikane.api.careers.CareerApplicationRepository;
import com.omoikane.api.contact.ContactSubmissionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Secured management endpoints for administrators and managers
 * to review contact form enquiries, job applications, and download candidate resumes.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private final ContactSubmissionRepository contactRepository;
    private final CareerApplicationRepository careerRepository;
    private final String adminSecretKey;

    public AdminController(
            ContactSubmissionRepository contactRepository,
            CareerApplicationRepository careerRepository,
            @Value("${app.admin.secret-key:}") String adminSecretKey) {
        this.contactRepository = contactRepository;
        this.careerRepository = careerRepository;
        this.adminSecretKey = adminSecretKey != null ? adminSecretKey.trim() : "";
    }

    private void authenticate(String headerKey, String queryKey) {
        String key = (headerKey != null && !headerKey.isBlank()) ? headerKey.trim() : (queryKey != null ? queryKey.trim() : null);
        if (adminSecretKey.isBlank() || key == null || !adminSecretKey.equals(key)) {
            log.warn("Unauthorized attempt to access admin endpoint");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid admin credentials");
        }
    }

    @PostMapping("/auth/verify")
    public ResponseEntity<Map<String, Object>> verifyKey(
            @RequestHeader(value = "X-Admin-Key", required = false) String headerKey,
            @RequestBody(required = false) Map<String, String> body) {
        String key = headerKey;
        if (key == null && body != null) {
            key = body.get("key");
        }
        authenticate(key, null);
        return ResponseEntity.ok(Map.of("valid", true, "message", "Admin authentication successful"));
    }

    // ── Contacts ──

    @GetMapping("/contacts")
    public ResponseEntity<List<ContactSubmission>> getContacts(
            @RequestHeader(value = "X-Admin-Key", required = false) String headerKey) {
        authenticate(headerKey, null);
        return ResponseEntity.ok(contactRepository.findAllByOrderByCreatedAtDesc());
    }

    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<Map<String, Object>> deleteContact(
            @PathVariable Long id,
            @RequestHeader(value = "X-Admin-Key", required = false) String headerKey) {
        authenticate(headerKey, null);
        if (!contactRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found");
        }
        contactRepository.deleteById(id);
        log.info("Contact submission [id={}] deleted by admin", id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Submission deleted"));
    }

    // ── Careers ──

    @GetMapping("/careers")
    public ResponseEntity<List<CareerApplicationSummary>> getCareers(
            @RequestHeader(value = "X-Admin-Key", required = false) String headerKey) {
        authenticate(headerKey, null);
        List<CareerApplicationSummary> summaries = careerRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(CareerApplicationSummary::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/careers/{id}/resume")
    public ResponseEntity<byte[]> downloadResume(
            @PathVariable Long id,
            @RequestHeader(value = "X-Admin-Key", required = false) String headerKey,
            @RequestParam(value = "key", required = false) String queryKey) {
        authenticate(headerKey, queryKey);

        CareerApplication application = careerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        if (application.getResumeData() == null || application.getResumeData().length == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume not attached");
        }

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(application.getResumeContentType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        String filename = application.getResumeFilename() != null ? application.getResumeFilename() : "resume.pdf";

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(application.getResumeData());
    }

    @DeleteMapping("/careers/{id}")
    public ResponseEntity<Map<String, Object>> deleteCareer(
            @PathVariable Long id,
            @RequestHeader(value = "X-Admin-Key", required = false) String headerKey) {
        authenticate(headerKey, null);
        if (!careerRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found");
        }
        careerRepository.deleteById(id);
        log.info("Career application [id={}] deleted by admin", id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Application deleted"));
    }
}
