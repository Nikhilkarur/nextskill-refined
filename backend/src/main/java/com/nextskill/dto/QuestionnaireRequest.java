package com.nextskill.dto;

import java.util.Map;

public class QuestionnaireRequest {
    private String role;
    private String experience;
    private String priority;
    private String timeCommitment;
    private Map<String, String> answers;
    private String resumeText; // optional if user pasted or pre-parsed

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getTimeCommitment() { return timeCommitment; }
    public void setTimeCommitment(String timeCommitment) { this.timeCommitment = timeCommitment; }
    public Map<String, String> getAnswers() { return answers; }
    public void setAnswers(Map<String, String> answers) { this.answers = answers; }
    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }
}
