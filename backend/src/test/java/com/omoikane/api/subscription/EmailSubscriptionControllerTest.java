package com.omoikane.api.subscription;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omoikane.api.common.config.RateLimitFilter;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EmailSubscriptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RateLimitFilter rateLimitFilter;

    @MockitoBean
    private EmailSubscriptionService subscriptionService;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final AtomicInteger ipCounter = new AtomicInteger(20);

    @BeforeEach
    void setUp() {
        rateLimitFilter.reset();
    }

    @Test
    void validSubscription_returns201() throws Exception {
        when(subscriptionService.subscribe(any(SubscriptionRequest.class), anyString()))
                .thenReturn(EmailSubscriptionService.Result.CREATED);

        SubscriptionRequest request = request("person@example.com", true);

        mockMvc.perform(subscriptionPost(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("You are subscribed to company updates."));
    }

    @Test
    void duplicateSubscription_returns200() throws Exception {
        when(subscriptionService.subscribe(any(SubscriptionRequest.class), anyString()))
                .thenReturn(EmailSubscriptionService.Result.ALREADY_ACTIVE);

        SubscriptionRequest request = request("person@example.com", true);

        mockMvc.perform(subscriptionPost(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void invalidEmail_returns400() throws Exception {
        SubscriptionRequest request = request("not-an-email", true);

        mockMvc.perform(subscriptionPost(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void missingConsent_returns400() throws Exception {
        SubscriptionRequest request = request("person@example.com", false);

        mockMvc.perform(subscriptionPost(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void validUnsubscribeToken_returns200() throws Exception {
        when(subscriptionService.unsubscribe("valid-token")).thenReturn(true);

        mockMvc.perform(delete("/api/subscriptions/valid-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void invalidUnsubscribeToken_returns404() throws Exception {
        when(subscriptionService.unsubscribe("invalid-token")).thenReturn(false);

        mockMvc.perform(delete("/api/subscriptions/invalid-token"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    private MockHttpServletRequestBuilder subscriptionPost(String body) {
        String testIp = "192.0.2." + ipCounter.incrementAndGet();
        return post("/api/subscriptions")
                .with(request -> {
                    request.setRemoteAddr(testIp);
                    return request;
                })
                .contentType(MediaType.APPLICATION_JSON)
                .content(body);
    }

    private SubscriptionRequest request(String email, boolean consent) {
        SubscriptionRequest request = new SubscriptionRequest();
        request.setEmail(email);
        request.setConsent(consent);
        return request;
    }
}
