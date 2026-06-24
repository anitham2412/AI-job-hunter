package com.ai.jobhunter.backend.controller;

import com.ai.jobhunter.backend.model.Job;
import com.ai.jobhunter.backend.scheduler.JobScheduler;
import com.ai.jobhunter.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j                    // ← THIS was missing! Enables log.info()
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    private final DashboardService dashboardService;
    private final JobScheduler jobScheduler;

    // ─── GET DASHBOARD STATS ──────────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(
            @RequestParam Long userId) {

        Map<String, Object> stats =
                dashboardService.getDashboardStats(userId);
        return ResponseEntity.ok(stats);
    }

    // ─── MANUAL SCHEDULER TRIGGER ─────────────────────────
    @PostMapping("/trigger")
    public ResponseEntity<String> triggerScheduler() {
        log.info("Manual scheduler trigger requested");

        new Thread(() -> jobScheduler.triggerNow()).start();

        return ResponseEntity.ok(
                "✅ Scheduler triggered! Check logs for progress.");
    }

    // ─── GET TOP MATCHED JOBS ─────────────────────────────
    @GetMapping("/top-jobs")
    public ResponseEntity<List<Job>> getTopJobs(
            @RequestParam(defaultValue = "70.0") Double minScore) {

        List<Job> topJobs =
                dashboardService.getTopMatchedJobs(minScore);
        return ResponseEntity.ok(topJobs);
    }
}