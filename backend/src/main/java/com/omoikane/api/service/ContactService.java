package com.omoikane.api.service;

import com.omoikane.api.dto.ContactRequest;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ContactService {
    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    public void processContactRequest(ContactRequest request) {
        logger.info("Processing new requirement from: {}", request.getEmail());
        logger.info("Requirement type: {}", request.getRequirement());
    }
}
