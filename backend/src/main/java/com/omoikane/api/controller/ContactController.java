package com.omoikane.api.controller;

import com.omoikane.api.dto.ContactRequest;
import com.omoikane.api.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contact")
@CrossOrigin(origins = "*") 
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitContact(@RequestBody ContactRequest request) {
        contactService.processContactRequest(request);
        return ResponseEntity.ok("Requirement submitted successfully.");
    }
}
