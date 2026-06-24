package com.ai.jobhunter.backend.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class GeneratedContentResponse {

    private Long userId;
    private Long jobId;
    private String jobTitle;
    private String company;

    private String tailoredResume;    // AI rewritten resume
    private String coverLetter;       // AI generated cover letter
    private String message;           // success message
}
