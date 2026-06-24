package com.ai.jobhunter.backend.controller;

import com.ai.jobhunter.backend.dto.GeneratedContentResponse;
import com.ai.jobhunter.backend.dto.ResumeGenerateRequest;
import com.ai.jobhunter.backend.service.ResumeGenerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/generate")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ResumeGenerationController {

    private final ResumeGenerationService resumeGenerationService;

    // ─── GENERATE RESUME + COVER LETTER ───────────────────
    // POST http://localhost:8080/api/generate
    @PostMapping
    public ResponseEntity<GeneratedContentResponse> generate(
            @RequestBody ResumeGenerateRequest request) {

        GeneratedContentResponse response =
                resumeGenerationService.generateAll(request);
        return ResponseEntity.ok(response);
    }

    // ─── GENERATE RESUME ONLY ─────────────────────────────
    // POST http://localhost:8080/api/generate/resume
    @PostMapping("/resume")
    public ResponseEntity<String> generateResume(
            @RequestParam Long userId,
            @RequestParam Long jobId,
            @RequestParam(defaultValue = "professional") String tone) {

        ResumeGenerateRequest request = new ResumeGenerateRequest();
        request.setUserId(userId);
        request.setJobId(jobId);
        request.setTone(tone);

        GeneratedContentResponse response =
                resumeGenerationService.generateAll(request);
        return ResponseEntity.ok(response.getTailoredResume());
    }

    // ─── GENERATE COVER LETTER ONLY ───────────────────────
    // POST http://localhost:8080/api/generate/cover-letter
    @PostMapping("/cover-letter")
    public ResponseEntity<String> generateCoverLetter(
            @RequestParam Long userId,
            @RequestParam Long jobId,
            @RequestParam(defaultValue = "professional") String tone) {

        ResumeGenerateRequest request = new ResumeGenerateRequest();
        request.setUserId(userId);
        request.setJobId(jobId);
        request.setTone(tone);

        GeneratedContentResponse response =
                resumeGenerationService.generateAll(request);
        return ResponseEntity.ok(response.getCoverLetter());
    }

    // ─── GET PREVIOUSLY GENERATED ─────────────────────────
    // GET http://localhost:8080/api/generate?userId=1&jobId=1
    @GetMapping
    public ResponseEntity<GeneratedContentResponse> getGenerated(
            @RequestParam Long userId,
            @RequestParam Long jobId) {

        return ResponseEntity.ok(
                resumeGenerationService.getGenerated(userId, jobId));
    }
}
