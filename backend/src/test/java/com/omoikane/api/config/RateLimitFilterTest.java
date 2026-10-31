package com.omoikane.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omoikane.api.dto.ContactRequest;
import com.omoikane.api.entity.ContactSubmission;
import com.omoikane.api.service.ContactService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RateLimitFilterTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RateLimitFilter rateLimitFilter;

    @MockitoBean
    private ContactService contactService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        rateLimitFilter.reset();
    }

    @Test
    void rateLimitReturns429AfterExceedingLimit() throws Exception {
        ContactSubmission saved = new ContactSubmission();
        saved.setName("Test");
        saved.setEmail("test@example.com");
        saved.setMessage("Hello");
        when(contactService.processContactRequest(any(ContactRequest.class), anyString()))
                .thenReturn(saved);

        ContactRequest req = new ContactRequest();
        req.setName("Rate Test");
        req.setEmail("rate@example.com");
        req.setMessage("Testing rate limit");

        String body = objectMapper.writeValueAsString(req);
        String testIp = "198.51.100.1";

        // First 5 requests should succeed (rate limit is 5/min in test profile)
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/contact")
                            .with(request -> {
                                request.setRemoteAddr(testIp);
                                return request;
                            })
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isCreated());
        }

        // 6th request from the exact same IP should be rate-limited
        mockMvc.perform(post("/api/contact")
                        .with(request -> {
                            request.setRemoteAddr(testIp);
                            return request;
                        })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Too many requests. Please try again later."));
    }
}
