package com.omoikane.api.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request body for company-update subscriptions.
 */
public class SubscriptionRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @AssertTrue(message = "Consent is required")
    private boolean consent;

    public SubscriptionRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isConsent() { return consent; }
    public void setConsent(boolean consent) { this.consent = consent; }
}
