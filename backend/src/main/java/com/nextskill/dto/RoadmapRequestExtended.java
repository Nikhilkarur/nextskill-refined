package com.nextskill.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class RoadmapRequestExtended extends RoadmapRequest {
    // Optional map of answer key->value from user questionnaire
    private Map<String, String> answers;

    // Optional extracted resume text summary (if upload occurred)
    private String resumeText;

    // Optional reference to a previously saved questionnaire response
    private Long questionnaireId;
}
