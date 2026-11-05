package com.omoikane.api.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Consistent JSON response envelope shared by every public API.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse {

    private final boolean success;
    private final String message;

    private ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public static ApiResponse ok(String message) {
        return new ApiResponse(true, message);
    }

    public static ApiResponse error(String message) {
        return new ApiResponse(false, message);
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}
