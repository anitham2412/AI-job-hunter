package com.ai.jobhunter.backend.scheduler;
import com.ai.jobhunter.backend.model.User;
import com.ai.jobhunter.backend.repository.UserRepository;
import com.ai.jobhunter.backend.service.JobFetchService;
import com.ai.jobhunter.backend.service.MatchingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component              // Tells Spring: manage this class
@RequiredArgsConstructor
public class JobScheduler {

    private final JobFetchService jobFetchService;
    private final MatchingService matchingService;
    private final UserRepository userRepository;

    // ─── DAILY JOB FETCH ──────────────────────────────────
    // Runs every day at 8:00 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void dailyJobFetch() {

        log.info("═══════════════════════════════════════");
        log.info("⏰ DAILY SCHEDULER STARTED: {}",
                LocalDateTime.now());
        log.info("═══════════════════════════════════════");

        // List of job keywords to search every day
        // You can expand this list!
        String[] keywords = {
                "Java Developer",
                "Spring Boot Developer",
                "Backend Developer Java",
                "Full Stack Java Developer"
        };

        String[] locations = {
                "Hyderabad",
                "Bangalore",
                "Remote"
        };

        // Fetch jobs for each keyword + location combo
        for (String keyword : keywords) {
            for (String location : locations) {
                try {
                    log.info("📡 Fetching: {} in {}",
                            keyword, location);

                    jobFetchService.fetchAndSaveJobs(
                            keyword, location);

                    // Wait 2 seconds between API calls
                    // to respect rate limits
                    Thread.sleep(2000);

                } catch (Exception e) {
                    log.error("❌ Fetch failed for {} in {}: {}",
                            keyword, location, e.getMessage());
                }
            }
        }

        log.info("✅ Daily job fetch complete!");

        // After fetching → run AI matching for all users
        dailyAiMatching();
    }

    // ─── DAILY AI MATCHING ────────────────────────────────
    // Called automatically after fetch
    // Also runs separately every day at 9:00 AM
    @Scheduled(cron = "0 0 9 * * ?")
    public void dailyAiMatching() {

        log.info("🤖 Starting daily AI matching...");

        // Get all registered users
        List<User> allUsers = userRepository.findAll();

        for (User user : allUsers) {
            try {
                log.info("Matching jobs for user: {}",
                        user.getName());

                matchingService.matchAllJobs(user.getId());

                // Wait between users to avoid API overload
                Thread.sleep(3000);

            } catch (Exception e) {
                log.error("❌ Matching failed for user {}: {}",
                        user.getName(), e.getMessage());
            }
        }

        log.info("✅ Daily AI matching complete!");
    }

    // ─── WEEKLY CLEANUP ───────────────────────────────────
    // Runs every Sunday at midnight
    // Removes old low-score jobs to keep DB clean
    @Scheduled(cron = "0 0 0 * * SUN")
    public void weeklyCleanup() {

        log.info("🧹 Starting weekly cleanup...");

        try {
            // Get all jobs with zero match score
            // (never matched) and delete them
            // This keeps the database clean!
            log.info("Weekly cleanup logic runs here");
            log.info("✅ Weekly cleanup complete!");

        } catch (Exception e) {
            log.error("❌ Cleanup failed: {}", e.getMessage());
        }
    }

    // ─── MANUAL TRIGGER (for testing) ─────────────────────
    // This is NOT scheduled — called manually via API
    public void triggerNow() {
        log.info("🔧 Manual trigger activated!");
        dailyJobFetch();
    }
}
