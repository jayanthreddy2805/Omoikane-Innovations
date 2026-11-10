package com.omoikane.api.common.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestPropertySource(properties = "server.forward-headers-strategy=native")
class RateLimitProxyTest {

    @Autowired
    private TestRestTemplate rest;

    @Autowired
    private RateLimitFilter rateLimitFilter;

    @BeforeEach
    void resetRateLimit() {
        rateLimitFilter.reset();
    }

    @Test
    void distinctClientsBehindProxyDoNotShareOneSubmissionBucket() {
        for (int i = 0; i < 5; i++) {
            assertEquals(HttpStatus.BAD_REQUEST, invalidContact("198.51.100.1").getStatusCode());
        }

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, invalidContact("198.51.100.1").getStatusCode());
        assertEquals(HttpStatus.BAD_REQUEST, invalidContact("198.51.100.2").getStatusCode());
    }

    private ResponseEntity<String> invalidContact(String clientIp) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Forwarded-For", clientIp);
        return rest.postForEntity("/api/contact", new HttpEntity<>("{}", headers), String.class);
    }
}
