package com.omoikane.api.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omoikane.api.contact.ContactRequest;
import com.omoikane.api.contact.ContactSubmission;
import com.omoikane.api.contact.ContactService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static org.junit.jupiter.api.Assertions.assertEquals;

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

    @Test
    void repeatedAdminKeyGuessesAreRateLimited() throws Exception {
        String testIp = "198.51.100.2";
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/admin/auth/verify")
                            .with(request -> { request.setRemoteAddr(testIp); return request; })
                            .header("X-Admin-Key", "wrong-key"))
                    .andExpect(status().isUnauthorized());
        }

        mockMvc.perform(post("/api/admin/auth/verify")
                        .with(request -> { request.setRemoteAddr(testIp); return request; })
                        .header("X-Admin-Key", "wrong-key"))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void simultaneousRequestsFromOneClientDoNotExceedTheBucket() throws Exception {
        ContactSubmission saved = new ContactSubmission();
        saved.setName("Load Test");
        saved.setEmail("load@example.com");
        saved.setMessage("Hello");
        when(contactService.processContactRequest(any(ContactRequest.class), anyString()))
                .thenReturn(saved);

        ContactRequest req = new ContactRequest();
        req.setName("Load Test");
        req.setEmail("load@example.com");
        req.setMessage("Concurrent form traffic");
        String body = objectMapper.writeValueAsString(req);
        int requests = 24;
        CountDownLatch start = new CountDownLatch(1);
        ExecutorService pool = Executors.newFixedThreadPool(requests);
        try {
            List<Future<Integer>> results = new ArrayList<>();
            for (int i = 0; i < requests; i++) {
                results.add(pool.submit(() -> {
                    start.await();
                    return mockMvc.perform(post("/api/contact")
                                    .with(request -> { request.setRemoteAddr("198.51.100.42"); return request; })
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(body))
                            .andReturn().getResponse().getStatus();
                }));
            }
            start.countDown();
            int accepted = 0;
            int throttled = 0;
            for (Future<Integer> result : results) {
                int status = result.get();
                if (status == 201) accepted++;
                if (status == 429) throttled++;
            }
            assertEquals(5, accepted);
            assertEquals(requests - 5, throttled);
        } finally {
            pool.shutdownNow();
        }
    }
}
