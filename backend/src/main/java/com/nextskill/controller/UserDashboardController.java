package com.nextskill.controller;

import com.nextskill.model.Roadmap;
import com.nextskill.repository.RoadmapRepository;
import com.nextskill.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserDashboardController {
    private final RoadmapRepository roadmapRepository;
    private final UserRepository userRepository;

    public UserDashboardController(RoadmapRepository roadmapRepository, UserRepository userRepository) {
        this.roadmapRepository = roadmapRepository;
        this.userRepository = userRepository;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(Authentication auth) {
        try {
            System.out.println("[Dashboard] Request from user: " + auth.getName());
            
            return userRepository.findByEmail(auth.getName())
                    .map(user -> {
                        System.out.println("[Dashboard] Found user with ID: " + user.getId());
                        
                        List<Roadmap> userRoadmaps = roadmapRepository.findByUser(user);
                        System.out.println("[Dashboard] User has " + userRoadmaps.size() + " roadmaps");
                        
                        // Debug: List all roadmap IDs and details
                        if (!userRoadmaps.isEmpty()) {
                            System.out.println("[Dashboard] Roadmap details:");
                            for (int i = 0; i < userRoadmaps.size(); i++) {
                                Roadmap rm = userRoadmaps.get(i);
                                System.out.println("  [" + i + "] ID=" + rm.getId() + ", Role=" + rm.getRole() + ", Created=" + rm.getCreatedAt());
                            }
                        }
                        
                        DashboardResponse response = new DashboardResponse();
                        response.setUserId(user.getId());
                        response.setUserEmail(user.getEmail());
                        response.setHasCompletedQuestionnaire(!userRoadmaps.isEmpty());
                        response.setTotalRoadmaps(userRoadmaps.size());
                        
                        if (!userRoadmaps.isEmpty()) {
                            // Get the most recent roadmap
                            Roadmap latestRoadmap = userRoadmaps.get(userRoadmaps.size() - 1);
                            try {
                                response.setLatestRoadmap(LatestRoadmapInfo.from(latestRoadmap));
                                response.setRedirectTo("roadmap");
                                System.out.println("[Dashboard] Redirecting to roadmap page");
                            } catch (Exception e) {
                                System.err.println("[Dashboard] Error processing latest roadmap: " + e.getMessage());
                                // Fallback: treat as if no roadmaps exist
                                response.setRedirectTo("questions");
                                System.out.println("[Dashboard] Fallback: Redirecting to questions page due to roadmap processing error");
                            }
                        } else {
                            response.setRedirectTo("questions");
                            System.out.println("[Dashboard] Redirecting to questions page");
                        }
                        
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        System.out.println("[Dashboard] User not found: " + auth.getName());
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            System.err.println("[Dashboard] Error processing request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    public static class DashboardResponse {
        private Long userId;
        private String userEmail;
        private boolean hasCompletedQuestionnaire;
        private LatestRoadmapInfo latestRoadmap;
        private int totalRoadmaps;
        private String redirectTo;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

        public boolean isHasCompletedQuestionnaire() { return hasCompletedQuestionnaire; }
        public void setHasCompletedQuestionnaire(boolean hasCompletedQuestionnaire) { this.hasCompletedQuestionnaire = hasCompletedQuestionnaire; }

        public LatestRoadmapInfo getLatestRoadmap() { return latestRoadmap; }
        public void setLatestRoadmap(LatestRoadmapInfo latestRoadmap) { this.latestRoadmap = latestRoadmap; }

        public int getTotalRoadmaps() { return totalRoadmaps; }
        public void setTotalRoadmaps(int totalRoadmaps) { this.totalRoadmaps = totalRoadmaps; }

        public String getRedirectTo() { return redirectTo; }
        public void setRedirectTo(String redirectTo) { this.redirectTo = redirectTo; }
    }

    public static class LatestRoadmapInfo {
        private Long id;
        private String role;
        private String experience;
        private String priority;
        private String timeCommitment;
        private String createdAt;

        static LatestRoadmapInfo from(Roadmap roadmap) {
            if (roadmap == null) {
                return null;
            }
            
            LatestRoadmapInfo info = new LatestRoadmapInfo();
            info.id = roadmap.getId();
            info.role = roadmap.getRole();
            info.experience = roadmap.getExperience();
            info.priority = roadmap.getPriority();
            info.timeCommitment = roadmap.getTimeCommitment();
            
            // Defensive handling of createdAt
            try {
                info.createdAt = roadmap.getCreatedAt() == null ? null : roadmap.getCreatedAt().toString();
            } catch (Exception e) {
                info.createdAt = "Unknown";
            }
            
            return info;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getExperience() { return experience; }
        public void setExperience(String experience) { this.experience = experience; }

        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }

        public String getTimeCommitment() { return timeCommitment; }
        public void setTimeCommitment(String timeCommitment) { this.timeCommitment = timeCommitment; }

        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }
}