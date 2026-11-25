package com.omoikane.api.email;
public class EmailDeliveryException extends RuntimeException {
    public EmailDeliveryException(){super("Transient email provider failure");}
}
