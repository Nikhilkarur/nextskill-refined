package com.nextskill.controller;

import com.nextskill.model.User;
import com.nextskill.repository.UserRepository;
import com.nextskill.util.ValidationUtil;
import com.nextskill.service.ResumeAnalysisService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeAnalysisService resumeService;
    private final UserRepository userRepository;

    public ResumeController(ResumeAnalysisService resumeService, UserRepository userRepository) {
        this.resumeService = resumeService;
        this.userRepository = userRepository;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file, Authentication auth) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("no file uploaded");
        }
        String ct = file.getContentType();
        if (!ValidationUtil.isAllowedResumeContentType(ct)) {
            return ResponseEntity.badRequest().body("unsupported file type");
        }
        // simple 10MB cap
        if (file.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("file too large");
        }
        String email = auth.getName();
        User domainUser = userRepository.findByEmail(email).orElse(null);
        if (domainUser == null) {
            return ResponseEntity.status(401).body("user not found; please sign in again");
        }

        String text = resumeService.extractText(file);
        resumeService.saveUpload(domainUser, file, text);
        String summary;
        if (text == null || text.isBlank()) {
            summary = "no text extracted";
        } else if (text.length() > 240) {
            summary = text.substring(0, 240) + "...";
        } else {
            summary = text;
        }
        return ResponseEntity.ok("parsed: " + summary);
    }
}
