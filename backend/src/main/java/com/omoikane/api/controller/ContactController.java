package com.omoikane.api.controller;

import com.omoikane.api.dto.ContactRequest;
import com.omoikane.api.dto.ContactResponse;
import com.omoikane.api.service.ContactService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactResponse> submitContact(
            @Valid @RequestBody ContactRequest request,
            HttpServletRequest httpRequest) {

        String clientIp = httpRequest.getRemoteAddr();
        contactService.processContactRequest(request, clientIp);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ContactResponse.ok("Your enquiry has been submitted successfully."));
    }
}
