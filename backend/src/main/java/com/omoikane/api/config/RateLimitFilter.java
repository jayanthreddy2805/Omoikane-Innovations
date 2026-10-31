package com.omoikane.api.config;

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
import java.util.concurrent.ConcurrentHashMap;

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
    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public RateLimitFilter(@Value("${app.rate-limit.requests-per-minute:5}") int requestsPerMinute) {
        this.requestsPerMinute = requestsPerMinute;
    }

    /**
     * Clears all in-memory rate-limiting buckets.
     * Used for test isolation and state resetting.
     */
    public void reset() {
        buckets.clear();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String clientIp = request.getRemoteAddr();
        Bucket bucket = buckets.computeIfAbsent(clientIp, this::createBucket);

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            log.info("Rate limit exceeded for IP: {}", clientIp);
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
        // Rate-limit contact and careers application submission endpoints
        String uri = request.getRequestURI();
        boolean isProtectedEndpoint = "/api/contact".equals(uri) || "/api/careers/apply".equals(uri);
        return !isProtectedEndpoint || !"POST".equalsIgnoreCase(request.getMethod());
    }

    private Bucket createBucket(String key) {
        return Bucket.builder()
                .addLimit(Bandwidth.builder()
                        .capacity(requestsPerMinute)
                        .refillGreedy(requestsPerMinute, Duration.ofMinutes(1))
                        .build())
                .build();
    }
}
