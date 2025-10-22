package com.nextskill.controller;

import com.nextskill.dto.QuestionnaireRequest;
import com.nextskill.model.QuestionnaireResponse;
import com.nextskill.model.User;
import com.nextskill.repository.QuestionnaireResponseRepository;
import com.nextskill.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/questions")
public class QuestionnaireController {

    private final QuestionnaireResponseRepository repo;
    private final UserRepository userRepository;

    public QuestionnaireController(QuestionnaireResponseRepository repo, UserRepository userRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/submit")
    public ResponseEntity<Long> submit(@RequestBody QuestionnaireRequest req, Authentication auth) {
        User u = userRepository.findByEmail(auth.getName()).orElse(null);
        if (u == null) {
            // Token belongs to a user that doesn't exist anymore (e.g., DB reset). Ask client to re-auth.
            return ResponseEntity.status(401).build();
        }

    QuestionnaireResponse qr = new QuestionnaireResponse();
        qr.setUser(u);
        qr.setDesiredRole(req.getRole());
        qr.setExperience(req.getExperience());
        qr.setPriority(req.getPriority());
        qr.setTimeCommitment(req.getTimeCommitment());
        qr.setResumeText(req.getResumeText());
        qr.setAnswersJson(answersToJson(req.getAnswers()));
        QuestionnaireResponse saved = repo.save(qr);
        return ResponseEntity.ok(saved.getId());
    }

    private String answersToJson(Map<String, String> answers) {
        if (answers == null || answers.isEmpty()) return "{}";
        StringBuilder sb = new StringBuilder();
        sb.append('{');
        boolean first = true;
        for (Map.Entry<String, String> e : answers.entrySet()) {
            if (!first) sb.append(',');
            first = false;
            sb.append('"').append(escape(e.getKey())).append('"').append(':')
              .append('"').append(escape(e.getValue())).append('"');
        }
        sb.append('}');
        return sb.toString();
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
