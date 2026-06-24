package com.ai.jobhunter.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String name;        // "Ravi Kumar"
    private String email;       // "ravi@gmail.com"
    private String password;    // "mypassword123"
    private String skills;      // "Java, Spring Boot, React"
    private String resumeText;  // Full resume pasted as text
}