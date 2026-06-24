package com.ai.jobhunter.backend.controller;

import com.ai.jobhunter.backend.model.Job;
import com.ai.jobhunter.backend.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {

    private final JobService jobService;

    // ─── FETCH JOBS FROM INTERNET ─────────────────────────
    // POST http://localhost:8080/api/jobs/fetch
    @PostMapping("/fetch")
    public ResponseEntity<List<Job>> fetchJobs(
            @RequestParam String keyword,
            @RequestParam String location) {

        List<Job> jobs = jobService.searchAndSaveJobs(keyword, location);
        return ResponseEntity.ok(jobs);
    }

    // ─── GET ALL SAVED JOBS ───────────────────────────────
    // GET http://localhost:8080/api/jobs
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    // ─── GET HIGH MATCH JOBS ──────────────────────────────
    // GET http://localhost:8080/api/jobs/matches?minScore=70
    @GetMapping("/matches")
    public ResponseEntity<List<Job>> getMatches(
            @RequestParam(defaultValue = "70.0") Double minScore) {

        return ResponseEntity.ok(jobService.getHighMatchJobs(minScore));
    }

    // ─── GET SINGLE JOB ──────────────────────────────────
    // GET http://localhost:8080/api/jobs/1
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }
}
