package com.ai.jobhunter.backend.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder  // lets us build this object nicely
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String skills;
    private String resumeText;
    // Note: we never send password back!
}
