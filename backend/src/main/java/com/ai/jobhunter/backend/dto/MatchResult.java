package com.ai.jobhunter.backend.dto;

import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class MatchResult {

    private Long jobId;
    private String jobTitle;
    private String company;

    private Double matchScore;          // 0.0 to 100.0

    private List<String> matchedSkills; // ["Java", "Spring Boot"]
    private List<String> missingSkills; // ["Kubernetes", "Docker"]

    private String summary;             // AI's overall assessment
    private String recommendation;      // "Strong Apply" / "Apply" / "Skip"
}
