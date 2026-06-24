package com.ai.jobhunter.backend.controller;

import com.ai.jobhunter.backend.dto.MatchResult;
import com.ai.jobhunter.backend.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MatchingController {

    private final MatchingService matchingService;

    // ─── MATCH ONE JOB ────────────────────────────────────
    // POST http://localhost:8080/api/match?userId=1&jobId=1
    @PostMapping
    public ResponseEntity<MatchResult> matchJob(
            @RequestParam Long userId,
            @RequestParam Long jobId) {

        MatchResult result = matchingService.matchJobWithResume(userId, jobId);
        return ResponseEntity.ok(result);
    }

    // ─── MATCH ALL JOBS ───────────────────────────────────
    // POST http://localhost:8080/api/match/all?userId=1
    @PostMapping("/all")
    public ResponseEntity<List<MatchResult>> matchAllJobs(
            @RequestParam Long userId) {

        List<MatchResult> results = matchingService.matchAllJobs(userId);
        return ResponseEntity.ok(results);
    }
}
