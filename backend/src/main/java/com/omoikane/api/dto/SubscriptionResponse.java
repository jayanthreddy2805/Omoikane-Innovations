package com.omoikane.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Safe response envelope for subscription operations.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubscriptionResponse {

    private final boolean success;
    private final String message;

    private SubscriptionResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public static SubscriptionResponse ok(String message) {
        return new SubscriptionResponse(true, message);
    }

    public static SubscriptionResponse error(String message) {
        return new SubscriptionResponse(false, message);
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}
