package com.ai.jobhunter.backend.service;

import com.ai.jobhunter.backend.dto.RegisterRequest;
import com.ai.jobhunter.backend.dto.UserResponse;
import com.ai.jobhunter.backend.model.User;
import com.ai.jobhunter.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service                      // Tells Spring: this is a Service layer class
@RequiredArgsConstructor      // Lombok: auto-generates constructor
public class UserService {

    // Spring automatically injects this (Dependency Injection)
    private final UserRepository userRepository;

    // ─── REGISTER NEW USER ───────────────────────────────
    public UserResponse register(RegisterRequest request) {

        // Step 1: Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }
        if (request.getResumeText() == null
                || request.getResumeText().trim().isEmpty()) {
            throw new RuntimeException(
                    "Resume text is required for AI matching!");
        }

        // Guard: skills cannot be empty
        if (request.getSkills() == null
                || request.getSkills().trim().isEmpty()) {
            throw new RuntimeException(
                    "Please enter at least one skill!");
        }

        // Step 2: Build the User object
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // (we'll encrypt later)
        user.setSkills(request.getSkills());
        user.setResumeText(request.getResumeText());

        // Step 3: Save to database
        User savedUser = userRepository.save(user);

        // Step 4: Return response (without password)
        return mapToResponse(savedUser);
    }

    // ─── GET USER PROFILE ────────────────────────────────
    public UserResponse getUserById(Long id) {

        // Find user or throw error if not found
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        return mapToResponse(user);
    }

    // ─── UPDATE RESUME ───────────────────────────────────
    public UserResponse updateResume(Long id, String resumeText) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // Update only the resume field
        user.setResumeText(resumeText);
        User updatedUser = userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    // ─── PRIVATE HELPER ──────────────────────────────────
    // Converts User model → UserResponse DTO
    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .skills(user.getSkills())
                .resumeText(user.getResumeText())
                .build();
    }
}
