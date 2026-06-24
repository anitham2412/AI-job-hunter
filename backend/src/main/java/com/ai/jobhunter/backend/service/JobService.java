package com.ai.jobhunter.backend.service;

import com.ai.jobhunter.backend.model.Job;
import com.ai.jobhunter.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobFetchService jobFetchService;

    // ─── TRIGGER JOB FETCH ────────────────────────────────
    public List<Job> searchAndSaveJobs(String keyword, String location) {
        return jobFetchService.fetchAndSaveJobs(keyword, location);
    }

    // ─── GET ALL JOBS FROM DB ─────────────────────────────
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // ─── GET HIGH MATCH JOBS ──────────────────────────────
    public List<Job> getHighMatchJobs(Double minScore) {
        return jobRepository
                .findByMatchScoreGreaterThanOrderByMatchScoreDesc(minScore);
    }

    // ─── GET JOB BY ID ───────────────────────────────────
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found!"));
    }
}
