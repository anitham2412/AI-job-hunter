package com.ai.jobhunter.backend.service;


import com.ai.jobhunter.backend.dto.JobResponse;
import com.ai.jobhunter.backend.model.Job;
import com.ai.jobhunter.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.ArrayList;
import java.util.List;

@Slf4j                    // Gives us log.info(), log.error() for logging
@Service
@RequiredArgsConstructor
public class JobFetchService {

    private final WebClient webClient;
    private final JobRepository jobRepository;

    // Reads values from application.properties
    @Value("${rapidapi.key}")
    private String apiKey;

    @Value("${rapidapi.host}")
    private String apiHost;

    @Value("${rapidapi.base-url}")
    private String baseUrl;

    // ─── MAIN METHOD: Fetch jobs by keyword ───────────────
    public List<Job> fetchAndSaveJobs(String keyword, String location) {

        log.info("Fetching jobs for: {} in {}", keyword, location);

        // Step 1: Build the search query
        String query = keyword + " " + location;

        // Step 2: Call JSearch API
        JobResponse response = webClient.get()
                .uri(baseUrl + "/search?query={query}&num_pages=1", query)
                .header("X-RapidAPI-Key", apiKey)
                .header("X-RapidAPI-Host", apiHost)
                .retrieve()
                .bodyToMono(JobResponse.class)
                .block();   // Wait for response (synchronous call)

        // Step 3: Check if we got data
        if (response == null || response.getData() == null) {
            log.warn("No jobs returned from API");
            return new ArrayList<>();
        }

        // Step 4: Convert API data → our Job model → save to DB
        List<Job> savedJobs = new ArrayList<>();

        for (JobResponse.JobData jobData : response.getData()) {

            // Skip if this job already exists in our DB
            // (avoid duplicates on repeated fetches)
            boolean alreadyExists = jobRepository
                    .findBySourceUrl(jobData.getJob_apply_link())
                    .isPresent();

            if (alreadyExists) {
                continue;  // skip this one, go to next
            }

            // Build our Job object from API data
            Job job = new Job();
            job.setTitle(jobData.getJob_title());
            job.setCompany(jobData.getEmployer_name());
            job.setDescription(jobData.getJob_description());
            job.setLocation(jobData.getJob_city() + ", "
                    + jobData.getJob_country());
            job.setSourceUrl(jobData.getJob_apply_link());
            job.setSource("JSearch");
            job.setMatchScore(0.0);  // Will be calculated by AI in Phase 5

            // Handle skills array safely
            if (jobData.getJob_required_skills() != null) {
                job.setSkillsRequired(
                        String.join(", ", jobData.getJob_required_skills())
                );
            }

            // Save to database
            Job saved = jobRepository.save(job);
            savedJobs.add(saved);
        }

        log.info("Saved {} new jobs to database", savedJobs.size());
        return savedJobs;
    }
}
