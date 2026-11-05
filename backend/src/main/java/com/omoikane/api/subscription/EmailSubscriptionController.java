package com.omoikane.api.subscription;

import com.omoikane.api.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
public class EmailSubscriptionController {

    private final EmailSubscriptionService subscriptionService;

    public EmailSubscriptionController(EmailSubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> subscribe(
            @Valid @RequestBody SubscriptionRequest request,
            HttpServletRequest httpRequest) {

        EmailSubscriptionService.Result result = subscriptionService.subscribe(
                request,
                httpRequest.getRemoteAddr()
        );

        HttpStatus status = result == EmailSubscriptionService.Result.CREATED
                ? HttpStatus.CREATED
                : HttpStatus.OK;

        String message = result == EmailSubscriptionService.Result.ALREADY_ACTIVE
                ? "This email is already subscribed to company updates."
                : "You are subscribed to company updates.";

        return ResponseEntity.status(status).body(ApiResponse.ok(message));
    }

    @DeleteMapping("/{token}")
    public ResponseEntity<ApiResponse> unsubscribe(@PathVariable String token) {
        boolean unsubscribed = subscriptionService.unsubscribe(token);
        if (!unsubscribed) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("This unsubscribe link is invalid or expired."));
        }

        return ResponseEntity.ok(ApiResponse.ok("You have been unsubscribed."));
    }
}
