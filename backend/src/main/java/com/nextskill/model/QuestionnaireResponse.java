package com.nextskill.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "questionnaire_responses")
public class QuestionnaireResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "desired_role", length = 128)
    private String desiredRole;

    @Column(length = 32)
    private String experience; // junior|mid|senior

    @Column(length = 32)
    private String priority; // skills|projects

    @Column(name = "time_commitment", length = 32)
    private String timeCommitment; // part-time|full-time

    @Lob
    @Column(name = "answers_json")
    private String answersJson; // serialized map

    @Lob
    @Column(name = "resume_text")
    private String resumeText;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getDesiredRole() { return desiredRole; }
    public void setDesiredRole(String desiredRole) { this.desiredRole = desiredRole; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getTimeCommitment() { return timeCommitment; }
    public void setTimeCommitment(String timeCommitment) { this.timeCommitment = timeCommitment; }

    public String getAnswersJson() { return answersJson; }
    public void setAnswersJson(String answersJson) { this.answersJson = answersJson; }

    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
