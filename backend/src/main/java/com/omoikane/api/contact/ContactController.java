package com.omoikane.api.contact;

import com.omoikane.api.common.dto.ApiResponse;
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
    public ResponseEntity<ApiResponse> submitContact(
            @Valid @RequestBody ContactRequest request,
            HttpServletRequest httpRequest) {

        String clientIp = httpRequest.getRemoteAddr();
        contactService.processContactRequest(request, clientIp);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Your enquiry has been submitted successfully."));
    }

    @ExceptionHandler(DuplicateContactException.class)
    public ResponseEntity<ApiResponse> duplicateContact() {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("Already submitted. These contact details have an existing enquiry."));
    }
}
