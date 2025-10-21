package com.nextskill.controller;

import com.nextskill.model.Roadmap;
import com.nextskill.repository.RoadmapRepository;
import com.nextskill.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roadmaps")
public class RoadmapHistoryController {
    private final RoadmapRepository roadmapRepository;
    private final UserRepository userRepository;

    public RoadmapHistoryController(RoadmapRepository roadmapRepository, UserRepository userRepository) {
        this.roadmapRepository = roadmapRepository;
        this.userRepository = userRepository;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mine")
    public ResponseEntity<List<RoadmapSummary>> myRoadmaps(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .map(u -> ResponseEntity.ok(
                        roadmapRepository.findByUser(u).stream().map(RoadmapSummary::from).collect(Collectors.toList())
                ))
                .orElseGet(() -> ResponseEntity.ok(List.of()));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<RoadmapDetail> getRoadmap(@PathVariable("id") Long id, Authentication auth) {
        return userRepository.findByEmail(auth.getName()).map(u ->
            roadmapRepository.findById(id)
                .filter(r -> r.getUser() != null && r.getUser().getId() != null && r.getUser().getId().equals(u.getId()))
                .map(r -> ResponseEntity.ok(RoadmapDetail.from(r)))
                .orElseGet(() -> ResponseEntity.notFound().build())
        ).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public static class RoadmapSummary {
        private Long id;
        private String role;
        private String experience;
        private String priority;
        private String timeCommitment;
        private String source;
        private String createdAt;

        static RoadmapSummary from(Roadmap r) {
            RoadmapSummary s = new RoadmapSummary();
            s.id = r.getId();
            s.role = r.getRole();
            s.experience = r.getExperience();
            s.priority = r.getPriority();
            s.timeCommitment = r.getTimeCommitment();
            s.source = r.getSource();
            s.createdAt = r.getCreatedAt() == null ? null : r.getCreatedAt().toString();
            return s;
        }

        public Long getId() { return id; }
        public String getRole() { return role; }
        public String getExperience() { return experience; }
        public String getPriority() { return priority; }
        public String getTimeCommitment() { return timeCommitment; }
        public String getSource() { return source; }
        public String getCreatedAt() { return createdAt; }
    }

    public static class RoadmapDetail {
        private Long id;
        private String role;
        private String experience;
        private String priority;
        private String timeCommitment;
        private String source;
        private String createdAt;
        private String contentJson;

        static RoadmapDetail from(com.nextskill.model.Roadmap r) {
            RoadmapDetail d = new RoadmapDetail();
            d.id = r.getId();
            d.role = r.getRole();
            d.experience = r.getExperience();
            d.priority = r.getPriority();
            d.timeCommitment = r.getTimeCommitment();
            d.source = r.getSource();
            d.createdAt = r.getCreatedAt() == null ? null : r.getCreatedAt().toString();
            d.contentJson = r.getContentJson();
            return d;
        }

        public Long getId() { return id; }
        public String getRole() { return role; }
        public String getExperience() { return experience; }
        public String getPriority() { return priority; }
        public String getTimeCommitment() { return timeCommitment; }
        public String getSource() { return source; }
        public String getCreatedAt() { return createdAt; }
        public String getContentJson() { return contentJson; }
    }
}
