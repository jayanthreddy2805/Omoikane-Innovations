package com.omoikane.api.careers;

import com.omoikane.api.common.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/careers")
public class CareerApplicationController {

    private static final Logger log = LoggerFactory.getLogger(CareerApplicationController.class);

    private final CareerApplicationService applicationService;

    public CareerApplicationController(CareerApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping(value = "/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> apply(@ModelAttribute CareerApplicationRequest request) throws IOException {
        applicationService.processApplication(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Your request has been submitted successfully."));
    }
}
