package com.ai.jobhunter.backend.service;

import com.ai.jobhunter.backend.dto.GeneratedContentResponse;
import com.ai.jobhunter.backend.dto.ResumeGenerateRequest;
import com.ai.jobhunter.backend.model.Job;
import com.ai.jobhunter.backend.model.Resume;
import com.ai.jobhunter.backend.model.User;
import com.ai.jobhunter.backend.repository.JobRepository;
import com.ai.jobhunter.backend.repository.ResumeRepository;
import com.ai.jobhunter.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeGenerationService {

    private final GroqService groqService;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;

    // ─── GENERATE BOTH RESUME + COVER LETTER ──────────────
    public GeneratedContentResponse generateAll(
            ResumeGenerateRequest request) {

        // Step 1: Fetch user and job from DB
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found!"));

        // Default tone if not provided
        String tone = request.getTone() != null
                ? request.getTone()
                : "professional";

        log.info("Generating content for {} applying to {} at {}",
                user.getName(), job.getTitle(), job.getCompany());

        // Step 2: Generate tailored resume via groq
        String tailoredResume = generateTailoredResume(user, job, tone);

        // Step 3: Generate cover letter via groq
        String coverLetter = generateCoverLetter(user, job, tone);

        // Step 4: Save both to database
        saveToDatabase(user, job, tailoredResume, coverLetter);

        // Step 5: Return full response
        return GeneratedContentResponse.builder()
                .userId(user.getId())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .company(job.getCompany())
                .tailoredResume(tailoredResume)
                .coverLetter(coverLetter)
                .message("Resume and cover letter generated successfully!")
                .build();
    }

    // ─── GENERATE TAILORED RESUME ─────────────────────────
    private String generateTailoredResume(User user, Job job, String tone) {

        String systemPrompt = """
                You are an expert resume writer with 15 years of experience.
                Your job is to rewrite a candidate's resume to better
                match a specific job description.

                Rules you MUST follow:
                - Keep all facts truthful — do NOT invent experience
                - Reorder and rephrase to highlight relevant skills
                - Use keywords from the job description naturally
                - Use strong action verbs: Built, Developed, Designed,
                  Implemented, Led, Optimized, Delivered
                - Keep it concise and ATS-friendly
                - Format with clear sections:
                  SUMMARY | SKILLS | EXPERIENCE | EDUCATION
                """;

        String userPrompt = """
                Rewrite this resume to match the job below.
                Tone: %s

                === ORIGINAL RESUME ===
                %s

                === TARGET JOB ===
                Title: %s
                Company: %s
                Required Skills: %s
                Description:
                %s

                Provide the complete rewritten resume now.
                """.formatted(
                tone,
                user.getResumeText(),
                job.getTitle(),
                job.getCompany(),
                job.getSkillsRequired(),
                job.getDescription()
        );

        log.info("Calling groq for tailored resume...");
        return groqService.sendPrompt(systemPrompt, userPrompt);
    }

    // ─── GENERATE COVER LETTER ────────────────────────────
    private String generateCoverLetter(User user, Job job, String tone) {

        String systemPrompt = """
                You are an expert cover letter writer.
                Write compelling, personalized cover letters that
                get candidates noticed by hiring managers.

                Structure to follow:
                Paragraph 1 — Strong opening, name the role, show enthusiasm
                Paragraph 2 — Connect candidate's top skills to job needs
                Paragraph 3 — Show knowledge of company, cultural fit
                Paragraph 4 — Confident closing with call to action

                Rules:
                - Sound human and genuine, not robotic
                - Do NOT just repeat the resume
                - Keep to 4 paragraphs max
                - End with: Sincerely, [Name]
                """;

        String userPrompt = """
                Write a cover letter for this candidate for this job.
                Tone: %s

                === CANDIDATE ===
                Name: %s
                Skills: %s
                Background:
                %s

                === JOB ===
                Title: %s
                Company: %s
                Required Skills: %s
                Description:
                %s

                Write the complete cover letter now.
                """.formatted(
                tone,
                user.getName(),
                user.getSkills(),
                user.getResumeText(),
                job.getTitle(),
                job.getCompany(),
                job.getSkillsRequired(),
                job.getDescription()
        );

        log.info("Calling groq for cover letter...");
        return groqService.sendPrompt(systemPrompt, userPrompt);
    }

    // ─── SAVE TO DATABASE ─────────────────────────────────
    private void saveToDatabase(User user, Job job,
                                String tailoredResume,
                                String coverLetter) {

        // If already generated before → update it
        // If never generated → create new
        Resume resume = resumeRepository
                .findByUserAndJob(user, job)
                .orElse(new Resume());

        resume.setUser(user);
        resume.setJob(job);
        resume.setTailoredContent(tailoredResume);
        resume.setCoverLetter(coverLetter);

        resumeRepository.save(resume);
        log.info("Saved generated resume & cover letter to DB");
    }

    // ─── FETCH PREVIOUSLY GENERATED ───────────────────────
    public GeneratedContentResponse getGenerated(Long userId, Long jobId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found!"));

        Resume resume = resumeRepository
                .findByUserAndJob(user, job)
                .orElseThrow(() -> new RuntimeException(
                        "Not generated yet! Please generate first."));

        return GeneratedContentResponse.builder()
                .userId(userId)
                .jobId(jobId)
                .jobTitle(job.getTitle())
                .company(job.getCompany())
                .tailoredResume(resume.getTailoredContent())
                .coverLetter(resume.getCoverLetter())
                .message("Fetched successfully!")
                .build();
    }
}
