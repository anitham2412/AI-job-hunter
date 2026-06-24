package com.ai.jobhunter.backend.dto;

import lombok.Data;

@Data
public class ResumeGenerateRequest {

    private Long userId;      // whose resume
    private Long jobId;       // which job to tailor for
    private String tone;      // "professional", "confident", "concise"
}
