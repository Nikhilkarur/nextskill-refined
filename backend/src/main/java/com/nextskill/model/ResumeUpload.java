package com.nextskill.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "resume_uploads")
public class ResumeUpload {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 512)
    private String filename;

    @Column(name = "uploaded_at")
    private Instant uploadedAt = Instant.now();

    @Lob
    private String extractedText;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }

    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }
}
