package com.omoikane.api.admin;

import com.omoikane.api.careers.CareerApplication;
import com.omoikane.api.careers.CareerApplicationRepository;
import com.omoikane.api.contact.ContactSubmissionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminControllerTest {

    @Test
    void resumeRequiresHeaderKeyAndSanitizesDownloadFilename() {
        ContactSubmissionRepository contacts = mock(ContactSubmissionRepository.class);
        CareerApplicationRepository careers = mock(CareerApplicationRepository.class);
        AdminController controller = new AdminController(contacts, careers, "test-secret");
        CareerApplication application = new CareerApplication();
        application.setResumeFilename("../candidate\".pdf");
        application.setResumeContentType("application/pdf");
        application.setResumeData(new byte[] { 1, 2, 3 });
        when(careers.findById(7L)).thenReturn(Optional.of(application));

        ResponseStatusException unauthorized = assertThrows(ResponseStatusException.class,
                () -> controller.downloadResume(7L, null));
        assertEquals(HttpStatus.UNAUTHORIZED, unauthorized.getStatusCode());
        verifyNoInteractions(careers);

        ResponseEntity<byte[]> response = controller.downloadResume(7L, "test-secret");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertArrayEquals(new byte[] { 1, 2, 3 }, response.getBody());
        String disposition = response.getHeaders().getFirst("Content-Disposition");
        assertNotNull(disposition);
        assertTrue(disposition.startsWith("attachment;"));
        assertFalse(disposition.contains("../"));
        assertFalse(disposition.contains("\r"));
        assertFalse(disposition.contains("\n"));
    }
}
