package com.omoikane.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omoikane.api.config.RateLimitFilter;
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
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.concurrent.atomic.AtomicInteger;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RateLimitFilter rateLimitFilter;

    @MockitoBean
    private ContactService contactService;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final AtomicInteger ipCounter = new AtomicInteger(1);

    @BeforeEach
    void setUp() {
        rateLimitFilter.reset();
    }

    private MockHttpServletRequestBuilder contactPost(String body) {
        String testIp = "192.0.2." + ipCounter.incrementAndGet();
        return post("/api/contact")
                .with(request -> {
                    request.setRemoteAddr(testIp);
                    return request;
                })
                .contentType(MediaType.APPLICATION_JSON)
                .content(body);
    }

    @Test
    void validRequest_returns201() throws Exception {
        ContactSubmission saved = new ContactSubmission();
        saved.setName("Test User");
        saved.setEmail("test@example.com");
        saved.setMessage("Hello");
        when(contactService.processContactRequest(any(ContactRequest.class), anyString()))
                .thenReturn(saved);

        ContactRequest req = new ContactRequest();
        req.setName("Test User");
        req.setEmail("test@example.com");
        req.setMessage("Hello, I need help with UAV systems.");

        mockMvc.perform(contactPost(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void missingName_returns400() throws Exception {
        ContactRequest req = new ContactRequest();
        req.setEmail("test@example.com");
        req.setMessage("Hello");

        mockMvc.perform(contactPost(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void missingEmail_returns400() throws Exception {
        ContactRequest req = new ContactRequest();
        req.setName("Test User");
        req.setMessage("Hello");

        mockMvc.perform(contactPost(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void invalidEmail_returns400() throws Exception {
        ContactRequest req = new ContactRequest();
        req.setName("Test User");
        req.setEmail("not-an-email");
        req.setMessage("Hello");

        mockMvc.perform(contactPost(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void missingMessage_returns400() throws Exception {
        ContactRequest req = new ContactRequest();
        req.setName("Test User");
        req.setEmail("test@example.com");

        mockMvc.perform(contactPost(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void emptyBody_returns400() throws Exception {
        mockMvc.perform(contactPost("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void malformedJson_returns400() throws Exception {
        mockMvc.perform(contactPost("{not json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void optionalFieldsAccepted() throws Exception {
        ContactSubmission saved = new ContactSubmission();
        saved.setName("Full User");
        saved.setEmail("full@example.com");
        saved.setMessage("Full message");
        when(contactService.processContactRequest(any(ContactRequest.class), anyString()))
                .thenReturn(saved);

        ContactRequest req = new ContactRequest();
        req.setName("Full User");
        req.setEmail("full@example.com");
        req.setCompany("Acme Corp");
        req.setPhone("+919876543210");
        req.setMessage("Full message with all optional fields.");

        mockMvc.perform(contactPost(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));
    }
}
