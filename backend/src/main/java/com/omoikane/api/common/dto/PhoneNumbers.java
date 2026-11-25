package com.omoikane.api.common.dto;

public final class PhoneNumbers {
    private PhoneNumbers() {}
    public static void validateOptional(String value) {
        if (value == null || value.isBlank()) return;
        String number = value.replaceAll("[\\s().-]", "");
        if (!number.matches("\\+?[1-9][0-9]{6,14}")) {
            throw new IllegalArgumentException("Enter a valid phone number.");
        }
    }
}
