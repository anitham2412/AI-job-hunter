package com.ai.jobhunter.backend.controller;

import com.ai.jobhunter.backend.dto.RegisterRequest;
import com.ai.jobhunter.backend.dto.UserResponse;
import com.ai.jobhunter.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController               // This class handles HTTP requests
@RequestMapping("/api/users") // All URLs in this class start with /api/users
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")  // Allow React to call this
public class UserController {

    private final UserService userService;

    // ─── REGISTER ─────────────────────────────────────────
    // POST http://localhost:8080/api/users/register
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @RequestBody RegisterRequest request) {

        UserResponse response = userService.register(request);
        return ResponseEntity.ok(response);
    }

    // ─── GET PROFILE ──────────────────────────────────────
    // GET http://localhost:8080/api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id) {

        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    // ─── UPDATE RESUME ────────────────────────────────────
    // PUT http://localhost:8080/api/users/{id}/resume
    @PutMapping("/{id}/resume")
    public ResponseEntity<UserResponse> updateResume(
            @PathVariable Long id,
            @RequestBody String resumeText) {

        UserResponse response = userService.updateResume(id, resumeText);
        return ResponseEntity.ok(response);
    }
}
