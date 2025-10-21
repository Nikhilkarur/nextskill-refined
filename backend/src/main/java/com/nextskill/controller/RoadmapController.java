package com.nextskill.controller;

import com.nextskill.dto.RoadmapRequestExtended;
import com.nextskill.model.QuestionnaireResponse;
import com.nextskill.model.Roadmap;
import com.nextskill.model.User;
import com.nextskill.repository.QuestionnaireResponseRepository;
import com.nextskill.repository.RoadmapRepository;
import com.nextskill.repository.UserRepository;
import com.nextskill.service.LearningPathMLService;
import com.nextskill.util.ValidationUtil;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Optional;

@RestController
@RequestMapping("/api/roadmaps")
public class RoadmapController {

    private final LearningPathMLService mlService;
    private final RoadmapRepository roadmapRepository;
    private final UserRepository userRepository;
    private final QuestionnaireResponseRepository questionnaireRepository;

    public RoadmapController(LearningPathMLService mlService,
                             RoadmapRepository roadmapRepository,
                             UserRepository userRepository,
                             QuestionnaireResponseRepository questionnaireRepository) {
        this.mlService = mlService;
        this.roadmapRepository = roadmapRepository;
        this.userRepository = userRepository;
        this.questionnaireRepository = questionnaireRepository;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(value = "/generate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> generate(@RequestBody RoadmapRequestExtended req, Authentication auth) {
    String role = ValidationUtil.normalizeRole(req.getRole());
    String experience = ValidationUtil.normalizeExperience(req.getExperience());
    String priority = ValidationUtil.normalizePriority(req.getPriority());
    String time = ValidationUtil.normalizeTime(req.getTimeCommitment());

        // If resume/answers are present, skip JSON and go straight to AI
        boolean hasSignals = (req.getResumeText() != null && !req.getResumeText().isBlank())
                || (req.getAnswers() != null && !req.getAnswers().isEmpty());
        String source;
        if (hasSignals) {
            String json = mlService.generateWithSignals(role, experience, priority, time, req.getResumeText(), req.getAnswers());
            source = "ai-signals";
            RoadmapPayload payload = new RoadmapPayload(role, experience, priority, time, json, source, req.getQuestionnaireId());
            persistRoadmap(auth, payload);
            return ResponseEntity.ok(json);
        }

        String filename = String.format("learning-paths/%s/%s_%s_%s_%s.json", role, role, experience, priority, time);
        String json = readResourceIfExists(filename);

        if (json == null || json.isBlank()) {
            json = mlService.generate(role, experience, priority, time);
            source = "ai";
        } else {
            source = "json";
        }

        RoadmapPayload payload = new RoadmapPayload(role, experience, priority, time, json, source, req.getQuestionnaireId());
        persistRoadmap(auth, payload);
        return ResponseEntity.ok(json);
    }

    private String readResourceIfExists(String path) {
        try {
            ClassPathResource resource = new ClassPathResource(path);
            if (!resource.exists()) return null;
            if (resource.isFile()) {
                return Files.readString(resource.getFile().toPath());
            }
            try (java.io.InputStream in = resource.getInputStream()) {
                byte[] bytes = in.readAllBytes();
                return new String(bytes, StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            return null;
        }
    }

    private void persistRoadmap(Authentication auth, RoadmapPayload payload) {
        try {
            if (auth == null) return;
            String email = auth.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) return;
            User user = userOpt.get();

            QuestionnaireResponse qr = null;
            if (payload.questionnaireId != null) {
                qr = questionnaireRepository.findById(payload.questionnaireId).orElse(null);
            }

            Roadmap rm = new Roadmap();
            rm.setUser(user);
            rm.setQuestionnaire(qr);
            rm.setRole(payload.role);
            rm.setExperience(payload.experience);
            rm.setPriority(payload.priority);
            rm.setTimeCommitment(payload.time);
            rm.setSource(payload.source);
            rm.setContentJson(payload.json);
            roadmapRepository.save(rm);
        } catch (Exception ignored) {
            // keep non-fatal; persistence shouldn't break response
        }
    }

    private static class RoadmapPayload {
        final String role;
        final String experience;
        final String priority;
        final String time;
        final String json;
        final String source;
        final Long questionnaireId;

        RoadmapPayload(String role, String experience, String priority, String time, String json, String source, Long questionnaireId) {
            this.role = role;
            this.experience = experience;
            this.priority = priority;
            this.time = time;
            this.json = json;
            this.source = source;
            this.questionnaireId = questionnaireId;
        }
    }
}
