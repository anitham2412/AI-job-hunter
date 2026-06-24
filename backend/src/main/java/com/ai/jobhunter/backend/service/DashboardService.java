package com.ai.jobhunter.backend.service;

import com.ai.jobhunter.backend.model.Application;
import com.ai.jobhunter.backend.model.Job;
import com.ai.jobhunter.backend.model.User;
import com.ai.jobhunter.backend.repository.ApplicationRepository;
import com.ai.jobhunter.backend.repository.JobRepository;
import com.ai.jobhunter.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    // ─── GET DASHBOARD STATS FOR A USER ───────────────────
    public Map<String, Object> getDashboardStats(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        // Fetch all data
        List<Job> allJobs = jobRepository.findAll();
        List<Application> allApplications =
                applicationRepository.findByUser(user);

        // Calculate stats
        long totalJobs    = allJobs.size();
        long highMatch    = allJobs.stream()
                .filter(j -> j.getMatchScore() != null
                        && j.getMatchScore() >= 80)
                .count();
        long mediumMatch  = allJobs.stream()
                .filter(j -> j.getMatchScore() != null
                        && j.getMatchScore() >= 60
                        && j.getMatchScore() < 80)
                .count();
        long totalApplied = allApplications.size();
        long interviews   = allApplications.stream()
                .filter(a -> a.getStatus() ==
                        Application.ApplicationStatus.INTERVIEW)
                .count();
        long offers       = allApplications.stream()
                .filter(a -> a.getStatus() ==
                        Application.ApplicationStatus.OFFER)
                .count();
        long rejected     = allApplications.stream()
                .filter(a -> a.getStatus() ==
                        Application.ApplicationStatus.REJECTED)
                .count();

        // Jobs fetched today
        long todayJobs = allJobs.stream()
                .filter(j -> j.getFetchedAt() != null
                        && j.getFetchedAt()
                        .toLocalDate()
                        .equals(LocalDate.now()))
                .count();

        // Build response map
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJobs",    totalJobs);
        stats.put("highMatch",    highMatch);
        stats.put("mediumMatch",  mediumMatch);
        stats.put("totalApplied", totalApplied);
        stats.put("interviews",   interviews);
        stats.put("offers",       offers);
        stats.put("rejected",     rejected);
        stats.put("todayJobs",    todayJobs);
        stats.put("lastUpdated",  LocalDateTime.now().toString());

        log.info("Dashboard stats calculated for user {}", userId);
        return stats;
    }

    // ─── GET TOP MATCHED JOBS ─────────────────────────────
    public List<Job> getTopMatchedJobs(Double minScore) {
        return jobRepository
                .findByMatchScoreGreaterThanOrderByMatchScoreDesc(minScore);
    }
}
