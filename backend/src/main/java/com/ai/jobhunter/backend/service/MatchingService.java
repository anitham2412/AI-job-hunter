package com.ai.jobhunter.backend.service;

import com.ai.jobhunter.backend.dto.MatchResult;
import com.ai.jobhunter.backend.model.Job;
import com.ai.jobhunter.backend.model.User;
import com.ai.jobhunter.backend.repository.JobRepository;
import com.ai.jobhunter.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final GroqService groqService;  // ✅ fixed lowercase
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public MatchResult matchJobWithResume(Long userId, Long jobId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found!"));

        String systemPrompt = buildSystemPrompt();
        String userPrompt = buildUserPrompt(user, job);

        String aiResponse = groqService.sendPrompt(systemPrompt, userPrompt);  // ✅ fixed

        MatchResult result = parseAiResponse(aiResponse, job);

        job.setMatchScore(result.getMatchScore());
        jobRepository.save(job);

        return result;
    }

    public List<MatchResult> matchAllJobs(Long userId) {

        // Only match jobs that haven't been scored yet
        // (score is 0.0 or null = never matched)
        List<Job> allJobs = jobRepository.findAll()
                .stream()
                .filter(j -> j.getMatchScore() == null
                        || j.getMatchScore() == 0.0)
                .collect(java.util.stream.Collectors.toList());

        List<MatchResult> results = new ArrayList<>();

        log.info("Matching {} unscored jobs for user {}",
                allJobs.size(), userId);

        for (Job job : allJobs) {
            try {
                // Skip jobs with no description
                if (job.getDescription() == null
                        || job.getDescription().isEmpty()) {
                    log.warn("Skipping job {} — no description",
                            job.getId());
                    continue;
                }

                MatchResult result =
                        matchJobWithResume(userId, job.getId());
                results.add(result);

                Thread.sleep(500);

            } catch (Exception e) {
                log.error("Error matching job {}: {}",
                        job.getId(), e.getMessage());
            }
        }

        results.sort((a, b) ->
                Double.compare(b.getMatchScore(), a.getMatchScore()));

        return results;
    }

    private String buildSystemPrompt() {
        return """
                You are an expert technical recruiter with 10 years of experience.
                Your job is to analyze a candidate's resume against a job description
                and provide a detailed match analysis.
                
                Always respond in this EXACT format:
                SCORE: [number between 0-100]
                MATCHED_SKILLS: [comma separated list]
                MISSING_SKILLS: [comma separated list]
                SUMMARY: [2-3 sentence assessment]
                RECOMMENDATION: [one of: Strong Apply, Apply, Consider, Skip]
                """;
    }

    private String buildUserPrompt(User user, Job job) {
        return """
                Please analyze this candidate's resume against the job description.
                
                === CANDIDATE RESUME ===
                Name: %s
                Skills: %s
                Resume:
                %s
                
                === JOB DESCRIPTION ===
                Title: %s
                Company: %s
                Required Skills: %s
                Description:
                %s
                
                Provide match analysis in the exact format specified.
                """.formatted(
                user.getName(),
                user.getSkills(),
                user.getResumeText(),
                job.getTitle(),
                job.getCompany(),
                job.getSkillsRequired(),
                job.getDescription()
        );
    }

    private MatchResult parseAiResponse(String aiResponse, Job job) {
        log.info("Parsing AI response...");

        double score = 0.0;
        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        String summary = "";
        String recommendation = "Consider";

        String[] lines = aiResponse.split("\n");

        for (String line : lines) {
            line = line.trim();

            if (line.startsWith("SCORE:")) {
                String scoreStr = line.replace("SCORE:", "").trim();
                score = Double.parseDouble(scoreStr.replaceAll("[^0-9.]", ""));

            } else if (line.startsWith("MATCHED_SKILLS:")) {
                String skills = line.replace("MATCHED_SKILLS:", "").trim();
                if (!skills.isEmpty() && !skills.equals("None")) {
                    matchedSkills = Arrays.asList(skills.split(",\\s*"));
                }

            } else if (line.startsWith("MISSING_SKILLS:")) {
                String skills = line.replace("MISSING_SKILLS:", "").trim();
                if (!skills.isEmpty() && !skills.equals("None")) {
                    missingSkills = Arrays.asList(skills.split(",\\s*"));
                }

            } else if (line.startsWith("SUMMARY:")) {
                summary = line.replace("SUMMARY:", "").trim();

            } else if (line.startsWith("RECOMMENDATION:")) {
                recommendation = line.replace("RECOMMENDATION:", "").trim();
            }
        }

        return MatchResult.builder()
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .company(job.getCompany())
                .matchScore(score)
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .summary(summary)
                .recommendation(recommendation)
                .build();
    }
}