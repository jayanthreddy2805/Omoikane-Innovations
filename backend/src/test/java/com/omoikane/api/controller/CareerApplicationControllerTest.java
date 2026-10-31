package com.omoikane.api.controller;

import com.omoikane.api.config.RateLimitFilter;
import com.omoikane.api.dto.CareerApplicationRequest;
import com.omoikane.api.entity.CareerApplication;
import com.omoikane.api.service.CareerApplicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;

import java.util.concurrent.atomic.AtomicInteger;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CareerApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RateLimitFilter rateLimitFilter;

    @MockitoBean
    private CareerApplicationService applicationService;

    private static final AtomicInteger ipCounter = new AtomicInteger(100);
    private static final byte[] VALID_PDF_BYTES = new byte[]{'%', 'P', 'D', 'F', '-', '1', '.', '4', 0x0a};

    @BeforeEach
    void setUp() {
        rateLimitFilter.reset();
    }

    private MockMultipartHttpServletRequestBuilder careerApplyPost(MockMultipartFile file) {
        String testIp = "192.0.2." + ipCounter.incrementAndGet();
        return (MockMultipartHttpServletRequestBuilder) multipart("/api/careers/apply")
                .file(file)
                .with(request -> {
                    request.setRemoteAddr(testIp);
                    return request;
                });
    }

    @Test
    void apply_validSubmission_returns201() throws Exception {
        CareerApplication saved = new CareerApplication();
        saved.setName("Alice");
        saved.setEmail("alice@example.com");
        when(applicationService.processApplication(any(CareerApplicationRequest.class))).thenReturn(saved);

        MockMultipartFile file = new MockMultipartFile(
                "resume", "cv.pdf", "application/pdf", VALID_PDF_BYTES
        );

        mockMvc.perform(careerApplyPost(file)
                        .param("name", "Alice")
                        .param("email", "alice@example.com")
                        .param("phone", "+919876543210")
                        .param("department", "software")
                        .param("role", "web-dev")
                        .param("message", "Cover letter text"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Your request has been submitted successfully."));
    }

    @Test
    void apply_missingName_returns400() throws Exception {
        when(applicationService.processApplication(any(CareerApplicationRequest.class)))
                .thenThrow(new IllegalArgumentException("Name is required"));

        MockMultipartFile file = new MockMultipartFile(
                "resume", "cv.pdf", "application/pdf", VALID_PDF_BYTES
        );

        mockMvc.perform(careerApplyPost(file)
                        .param("email", "alice@example.com")
                        .param("department", "software")
                        .param("role", "web-dev")
                        .param("message", "Cover letter text"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Name is required"));
    }

    @Test
    void apply_invalidFileContent_returns400() throws Exception {
        when(applicationService.processApplication(any(CareerApplicationRequest.class)))
                .thenThrow(new IllegalArgumentException("Invalid PDF file content"));

        MockMultipartFile file = new MockMultipartFile(
                "resume", "cv.pdf", "application/pdf", new byte[]{0x00, 0x01, 0x02, 0x03}
        );

        mockMvc.perform(careerApplyPost(file)
                        .param("name", "Alice")
                        .param("email", "alice@example.com")
                        .param("department", "software")
                        .param("role", "web-dev")
                        .param("message", "Cover letter text"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid PDF file content"));
    }

    @Test
    void apply_invalidDepartmentOrRole_returns400() throws Exception {
        when(applicationService.processApplication(any(CareerApplicationRequest.class)))
                .thenThrow(new IllegalArgumentException("Invalid role 'invalid-role' for department 'software'"));

        MockMultipartFile file = new MockMultipartFile(
                "resume", "cv.pdf", "application/pdf", VALID_PDF_BYTES
        );

        mockMvc.perform(careerApplyPost(file)
                        .param("name", "Alice")
                        .param("email", "alice@example.com")
                        .param("department", "software")
                        .param("role", "invalid-role")
                        .param("message", "Cover letter text"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid role 'invalid-role' for department 'software'"));
    }

    @Test
    void apply_rateLimitReturns429AfterExceedingLimit() throws Exception {
        CareerApplication saved = new CareerApplication();
        when(applicationService.processApplication(any(CareerApplicationRequest.class))).thenReturn(saved);

        MockMultipartFile file = new MockMultipartFile(
                "resume", "cv.pdf", "application/pdf", VALID_PDF_BYTES
        );

        String testIp = "198.51.100.99";

        // First 5 requests should succeed
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(multipart("/api/careers/apply")
                            .file(file)
                            .param("name", "Alice")
                            .param("email", "alice@example.com")
                            .param("department", "software")
                            .param("role", "web-dev")
                            .param("message", "Cover letter text")
                            .with(request -> {
                                request.setRemoteAddr(testIp);
                                return request;
                            }))
                    .andExpect(status().isCreated());
        }

        // 6th request from the same IP should return 429
        mockMvc.perform(multipart("/api/careers/apply")
                        .file(file)
                        .param("name", "Alice")
                        .param("email", "alice@example.com")
                        .param("department", "software")
                        .param("role", "web-dev")
                        .param("message", "Cover letter text")
                        .with(request -> {
                            request.setRemoteAddr(testIp);
                            return request;
                        }))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Too many requests. Please try again later."));
    }
}
