package com.nextskill.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "roadmaps")
public class Roadmap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questionnaire_id")
    private QuestionnaireResponse questionnaire;

    @Column(length = 128)
    private String role;

    @Column(length = 32)
    private String experience;

    @Column(length = 32)
    private String priority;

    @Column(name = "time_commitment", length = 32)
    private String timeCommitment;

    @Column(length = 32)
    private String source; // json|ai|ai-signals

    @Lob
    @Column(name = "content_json")
    private String contentJson;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public QuestionnaireResponse getQuestionnaire() { return questionnaire; }
    public void setQuestionnaire(QuestionnaireResponse questionnaire) { this.questionnaire = questionnaire; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getTimeCommitment() { return timeCommitment; }
    public void setTimeCommitment(String timeCommitment) { this.timeCommitment = timeCommitment; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getContentJson() { return contentJson; }
    public void setContentJson(String contentJson) { this.contentJson = contentJson; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
