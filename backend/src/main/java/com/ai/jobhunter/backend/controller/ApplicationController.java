package com.ai.jobhunter.backend.controller;

import com.ai.jobhunter.backend.model.Application;
import com.ai.jobhunter.backend.model.Job;
import com.ai.jobhunter.backend.model.User;
import com.ai.jobhunter.backend.repository.ApplicationRepository;
import com.ai.jobhunter.backend.repository.JobRepository;
import com.ai.jobhunter.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    // ─── APPLY TO A JOB ───────────────────────────────────
    // POST http://localhost:8080/api/applications
    @PostMapping
    public ResponseEntity<Application> applyToJob(
            @RequestParam Long userId,
            @RequestParam Long jobId,
            @RequestParam(required = false) String notes) {

        // Check if already applied to this job
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found!"));

        // Check for duplicate application
        List<Application> existing = applicationRepository
                .findByUser(user);

        boolean alreadyApplied = existing.stream()
                .anyMatch(a -> a.getJob().getId().equals(jobId));

        if (alreadyApplied) {
            throw new RuntimeException(
                    "Already applied to this job!");
        }

        // Create new application
        Application application = new Application();
        application.setUser(user);
        application.setJob(job);
        application.setNotes(notes);
        // Status defaults to APPLIED (set in @PrePersist)

        Application saved = applicationRepository.save(application);
        return ResponseEntity.ok(saved);
    }

    // ─── GET ALL APPLICATIONS FOR USER ────────────────────
    // GET http://localhost:8080/api/applications?userId=1
    @GetMapping
    public ResponseEntity<List<Application>> getApplications(
            @RequestParam Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        List<Application> applications =
                applicationRepository.findByUser(user);

        return ResponseEntity.ok(applications);
    }

    // ─── UPDATE APPLICATION STATUS ────────────────────────
    // PUT http://localhost:8080/api/applications/1/status
    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Application application = applicationRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found!"));

        // Convert string to enum safely
        Application.ApplicationStatus newStatus =
                Application.ApplicationStatus.valueOf(
                        status.toUpperCase());

        application.setStatus(newStatus);
        Application updated = applicationRepository.save(application);

        return ResponseEntity.ok(updated);
    }

    // ─── UPDATE NOTES ─────────────────────────────────────
    // PUT http://localhost:8080/api/applications/1/notes
    @PutMapping("/{id}/notes")
    public ResponseEntity<Application> updateNotes(
            @PathVariable Long id,
            @RequestBody String notes) {

        Application application = applicationRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found!"));

        application.setNotes(notes);
        Application updated = applicationRepository.save(application);

        return ResponseEntity.ok(updated);
    }

    // ─── DELETE APPLICATION ───────────────────────────────
    // DELETE http://localhost:8080/api/applications/1
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteApplication(
            @PathVariable Long id) {

        applicationRepository.deleteById(id);
        return ResponseEntity.ok("Application deleted!");
    }

    // ─── GET APPLICATIONS BY STATUS ───────────────────────
    // GET http://localhost:8080/api/applications/status
    //     ?userId=1&status=INTERVIEW
    @GetMapping("/status")
    public ResponseEntity<List<Application>> getByStatus(
            @RequestParam Long userId,
            @RequestParam String status) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        Application.ApplicationStatus appStatus =
                Application.ApplicationStatus.valueOf(
                        status.toUpperCase());

        List<Application> applications =
                applicationRepository.findByUserAndStatus(
                        user, appStatus);

        return ResponseEntity.ok(applications);
    }
}
