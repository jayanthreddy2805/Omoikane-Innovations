package com.omoikane.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Consistent JSON response envelope for the contact API.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ContactResponse {

    private final boolean success;
    private final String message;

    private ContactResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public static ContactResponse ok(String message) {
        return new ContactResponse(true, message);
    }

    public static ContactResponse error(String message) {
        return new ContactResponse(false, message);
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}
