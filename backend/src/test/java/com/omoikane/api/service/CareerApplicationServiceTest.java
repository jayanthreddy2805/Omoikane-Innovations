package com.omoikane.api.service;

import com.omoikane.api.dto.CareerApplicationRequest;
import com.omoikane.api.entity.CareerApplication;
import com.omoikane.api.repository.CareerApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CareerApplicationServiceTest {

    @Mock
    private CareerApplicationRepository repository;

    @Mock
    private ResendEmailService emailService;

    private CareerApplicationService service;

    private static final byte[] VALID_PDF_BYTES = new byte[]{'%', 'P', 'D', 'F', '-', '1', '.', '4', 0x0a};
    private static final byte[] VALID_DOCX_BYTES = new byte[]{0x50, 0x4B, 0x03, 0x04, 0x00, 0x00};
    private static final byte[] VALID_DOC_BYTES = new byte[]{(byte) 0xD0, (byte) 0xCF, 0x11, (byte) 0xE0, 0x00, 0x00};

    @BeforeEach
    void setUp() {
        service = new CareerApplicationService(repository, emailService);
    }

    @Test
    void processApplication_validRequest_persistsApplication() throws IOException {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("Jane Doe");
        req.setEmail("jane@example.com");
        req.setPhone("+919876543210");
        req.setDepartment("software");
        req.setRole("web-dev");
        req.setMessage("I would love to join your engineering team.");

        MockMultipartFile file = new MockMultipartFile(
                "resume", "cv.pdf", "application/pdf", VALID_PDF_BYTES
        );
        req.setResume(file);

        when(repository.save(any(CareerApplication.class))).thenAnswer(inv -> inv.getArgument(0));

        CareerApplication result = service.processApplication(req);

        assertNotNull(result);
        assertEquals("Jane Doe", result.getName());
        assertEquals("jane@example.com", result.getEmail());
        assertEquals("+919876543210", result.getPhone());
        assertEquals("software", result.getDepartment());
        assertEquals("web-dev", result.getRoleId());
        assertEquals("Web Developer", result.getRoleTitle());
        assertEquals("cv.pdf", result.getResumeFilename());
        assertEquals("application/pdf", result.getResumeContentType());
        assertArrayEquals(VALID_PDF_BYTES, result.getResumeData());
        assertEquals("PENDING", result.getStatus());

        verify(repository, times(1)).save(any(CareerApplication.class));
    }

    @Test
    void processApplication_missingName_throwsException() {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setEmail("jane@example.com");
        req.setDepartment("software");
        req.setRole("web-dev");
        req.setMessage("Cover letter");
        req.setResume(new MockMultipartFile("resume", "cv.pdf", "application/pdf", VALID_PDF_BYTES));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.processApplication(req));
        assertTrue(ex.getMessage().contains("Name is required"));
    }

    @Test
    void processApplication_invalidEmail_throwsException() {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("Jane");
        req.setEmail("invalid-email");
        req.setDepartment("software");
        req.setRole("web-dev");
        req.setMessage("Cover letter");
        req.setResume(new MockMultipartFile("resume", "cv.pdf", "application/pdf", VALID_PDF_BYTES));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.processApplication(req));
        assertTrue(ex.getMessage().contains("Invalid email format"));
    }

    @Test
    void processApplication_missingMessage_throwsException() {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("Jane");
        req.setEmail("jane@example.com");
        req.setDepartment("software");
        req.setRole("web-dev");
        req.setResume(new MockMultipartFile("resume", "cv.pdf", "application/pdf", VALID_PDF_BYTES));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.processApplication(req));
        assertTrue(ex.getMessage().contains("Cover letter / message is required"));
    }

    @Test
    void processApplication_invalidDepartment_throwsException() {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("Jane");
        req.setEmail("jane@example.com");
        req.setDepartment("invalid-dept");
        req.setRole("web-dev");
        req.setMessage("Cover letter");
        req.setResume(new MockMultipartFile("resume", "cv.pdf", "application/pdf", VALID_PDF_BYTES));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.processApplication(req));
        assertTrue(ex.getMessage().contains("Invalid department"));
    }

    @Test
    void processApplication_invalidRoleForDepartment_throwsException() {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("Jane");
        req.setEmail("jane@example.com");
        req.setDepartment("mechanical");
        req.setRole("web-dev"); // web-dev is software, not mechanical
        req.setMessage("Cover letter");
        req.setResume(new MockMultipartFile("resume", "cv.pdf", "application/pdf", VALID_PDF_BYTES));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.processApplication(req));
        assertTrue(ex.getMessage().contains("Invalid role"));
    }

    @Test
    void processApplication_missingResume_throwsException() {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("Jane");
        req.setEmail("jane@example.com");
        req.setDepartment("software");
        req.setRole("web-dev");
        req.setMessage("Cover letter");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.processApplication(req));
        assertTrue(ex.getMessage().contains("Resume file is required"));
    }

    @Test
    void processApplication_disguisedPdfFile_throwsException() {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("Jane");
        req.setEmail("jane@example.com");
        req.setDepartment("software");
        req.setRole("web-dev");
        req.setMessage("Cover letter");
        // An executable or plain text named as .pdf
        byte[] fakePdfBytes = new byte[]{'E', 'X', 'E', '!', 0x00, 0x00};
        req.setResume(new MockMultipartFile("resume", "malicious.pdf", "application/pdf", fakePdfBytes));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.processApplication(req));
        assertTrue(ex.getMessage().contains("Invalid PDF file content"));
    }

    @Test
    void processApplication_invalidExtension_throwsException() {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("Jane");
        req.setEmail("jane@example.com");
        req.setDepartment("software");
        req.setRole("web-dev");
        req.setMessage("Cover letter");
        req.setResume(new MockMultipartFile("resume", "cv.exe", "application/octet-stream", new byte[]{0x4D, 0x5A, 0x00, 0x00}));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.processApplication(req));
        assertTrue(ex.getMessage().contains("Please upload a valid PDF or Word document"));
    }

    @Test
    void processApplication_fileExceeding5MB_throwsException() {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("Jane");
        req.setEmail("jane@example.com");
        req.setDepartment("software");
        req.setRole("web-dev");
        req.setMessage("Cover letter");

        byte[] largeBytes = new byte[5 * 1024 * 1024 + 10];
        largeBytes[0] = '%'; largeBytes[1] = 'P'; largeBytes[2] = 'D'; largeBytes[3] = 'F';
        req.setResume(new MockMultipartFile("resume", "large.pdf", "application/pdf", largeBytes));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.processApplication(req));
        assertTrue(ex.getMessage().contains("File exceeds maximum size of 5 MB"));
    }

    @Test
    void processApplication_validDocx_succeeds() throws IOException {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("John");
        req.setEmail("john@example.com");
        req.setDepartment("mechanical");
        req.setRole("mech-design");
        req.setMessage("Mechanical engineer application");
        req.setResume(new MockMultipartFile("resume", "resume.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", VALID_DOCX_BYTES));

        when(repository.save(any(CareerApplication.class))).thenAnswer(inv -> inv.getArgument(0));

        CareerApplication result = service.processApplication(req);
        assertEquals("mech-design", result.getRoleId());
        assertEquals("3D & 2D Mechanical Design", result.getRoleTitle());
    }

    @Test
    void processApplication_validDoc_succeeds() throws IOException {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("John");
        req.setEmail("john@example.com");
        req.setDepartment("electronics");
        req.setRole("rf-eng");
        req.setMessage("RF engineer application");
        req.setResume(new MockMultipartFile("resume", "resume.doc", "application/msword", VALID_DOC_BYTES));

        when(repository.save(any(CareerApplication.class))).thenAnswer(inv -> inv.getArgument(0));

        CareerApplication result = service.processApplication(req);
        assertEquals("rf-eng", result.getRoleId());
        assertEquals("RF & Communications", result.getRoleTitle());
    }

    @Test
    void processApplication_triggersEmail_withActualDatabaseId() throws Exception {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("Jane Applicant");
        req.setEmail("jane.applicant@example.com");
        req.setDepartment("software");
        req.setRole("web-dev");
        req.setMessage("Application message");
        req.setResume(new MockMultipartFile("resume", "cv.pdf", "application/pdf", VALID_PDF_BYTES));

        when(repository.save(any(CareerApplication.class))).thenAnswer(inv -> {
            CareerApplication app = inv.getArgument(0);
            java.lang.reflect.Field idField = CareerApplication.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(app, 789L);
            return app;
        });
        when(emailService.sendCareerConfirmation(any(CareerApplication.class))).thenReturn(true);

        CareerApplication result = service.processApplication(req);

        assertNotNull(result);
        assertEquals(789L, result.getId());

        verify(emailService, times(1)).sendCareerConfirmation(argThat(app ->
                app != null
                        && Long.valueOf(789L).equals(app.getId())
                        && "jane.applicant@example.com".equals(app.getEmail())
                        && "Jane Applicant".equals(app.getName())
                        && "software".equals(app.getDepartment())
                        && "Web Developer".equals(app.getRoleTitle())
        ));
    }

    @Test
    void processApplication_emailFailure_preservesRecord() throws Exception {
        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("Jane Applicant");
        req.setEmail("jane.applicant@example.com");
        req.setDepartment("software");
        req.setRole("web-dev");
        req.setMessage("Application message");
        req.setResume(new MockMultipartFile("resume", "cv.pdf", "application/pdf", VALID_PDF_BYTES));

        when(repository.save(any(CareerApplication.class))).thenAnswer(inv -> {
            CareerApplication app = inv.getArgument(0);
            java.lang.reflect.Field idField = CareerApplication.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(app, 101L);
            return app;
        });
        when(emailService.sendCareerConfirmation(any(CareerApplication.class)))
                .thenThrow(new RuntimeException("Resend API 500"));

        CareerApplication result = service.processApplication(req);

        assertNotNull(result);
        assertEquals(101L, result.getId());
        verify(repository, times(1)).save(any(CareerApplication.class));
    }

    @Test
    void processApplication_withNullEmailService_doesNotThrow() throws Exception {
        CareerApplicationService noEmailService = new CareerApplicationService(repository);

        CareerApplicationRequest req = new CareerApplicationRequest();
        req.setName("Jane Applicant");
        req.setEmail("jane.applicant@example.com");
        req.setDepartment("software");
        req.setRole("web-dev");
        req.setMessage("Application message");
        req.setResume(new MockMultipartFile("resume", "cv.pdf", "application/pdf", VALID_PDF_BYTES));

        when(repository.save(any(CareerApplication.class))).thenAnswer(inv -> inv.getArgument(0));

        CareerApplication result = noEmailService.processApplication(req);
        assertNotNull(result);
    }
}
