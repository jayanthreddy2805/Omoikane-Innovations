package com.omoikane.api.common.config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;

/**
 * In-memory per-IP rate limiter using Bucket4j.
 * <p>
 * <b>Limitation:</b> This uses an in-memory token bucket per IP address.
 * In a multi-instance deployment, each instance maintains its own counters,
 * so the effective limit is multiplied by the number of instances. For
 * distributed rate limiting, use a shared store such as Redis.
 * <p>
 * IP resolution uses {@code HttpServletRequest.getRemoteAddr()} — the direct
 * TCP peer address — rather than spoofable forwarded headers like
 * {@code X-Forwarded-For}. If behind a trusted reverse proxy, configure
 * Spring's {@code server.forward-headers-strategy=NATIVE} and the framework
 * will set remoteAddr from the proxy header.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);

    private final int requestsPerMinute;
    // Bound memory under high-cardinality traffic; idle clients expire. This
    // remains an instance-local limiter, so do not scale out without a shared store.
    private final Cache<String, Bucket> buckets = Caffeine.newBuilder()
            .expireAfterAccess(Duration.ofMinutes(5))
            .maximumSize(100_000)
            .build();
    // Admin reads/downloads are also protected against unbounded key guessing.
    // Keep a separate, less restrictive bucket so normal dashboard requests
    // do not consume the stricter login verification allowance.
    private static final int ADMIN_REQUESTS_PER_MINUTE = 30;
    private final Cache<String, Bucket> adminBuckets = Caffeine.newBuilder()
            .expireAfterAccess(Duration.ofMinutes(5))
            .maximumSize(100_000)
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public RateLimitFilter(@Value("${app.rate-limit.requests-per-minute:5}") int requestsPerMinute) {
        this.requestsPerMinute = requestsPerMinute;
    }

    /**
     * Clears all in-memory rate-limiting buckets.
     * Used for test isolation and state resetting.
     */
    public void reset() {
        buckets.invalidateAll();
        adminBuckets.invalidateAll();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String clientIp = request.getRemoteAddr();
        boolean isAdminRequest = request.getRequestURI().startsWith("/api/admin/")
                && !"/api/admin/auth/verify".equals(request.getRequestURI());
        Bucket bucket = isAdminRequest
                ? adminBuckets.get(clientIp, key -> createBucket(ADMIN_REQUESTS_PER_MINUTE))
                : buckets.get(clientIp, key -> createBucket(requestsPerMinute));

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            log.info("Public endpoint rate limit exceeded");
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(
                objectMapper.writeValueAsString(
                    Map.of("success", false, "message", "Too many requests. Please try again later.")
                )
            );
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Rate-limit public form submissions and unsubscribe-token attempts
        String uri = request.getRequestURI();
        boolean isPublicSubmission = "POST".equalsIgnoreCase(request.getMethod())
                && ("/api/contact".equals(uri)
                || "/api/careers/apply".equals(uri)
                || "/api/subscriptions".equals(uri));
        boolean isUnsubscribeAttempt = "DELETE".equalsIgnoreCase(request.getMethod())
                && uri.startsWith("/api/subscriptions/");
        boolean isAdminVerification = "POST".equalsIgnoreCase(request.getMethod())
                && "/api/admin/auth/verify".equals(uri);
        boolean isAdminEndpoint = uri.startsWith("/api/admin/");
        return !isPublicSubmission && !isUnsubscribeAttempt && !isAdminVerification && !isAdminEndpoint;
    }

    private Bucket createBucket(int capacity) {
        return Bucket.builder()
                .addLimit(Bandwidth.builder()
                        .capacity(capacity)
                        .refillGreedy(capacity, Duration.ofMinutes(1))
                        .build())
                .build();
    }
}
