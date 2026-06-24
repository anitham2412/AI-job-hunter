package com.ai.jobhunter.backend.repository;

import com.ai.jobhunter.backend.model.Job;  // ✅ fixed
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {

    // Find all jobs above a certain match score
    List<Job> findByMatchScoreGreaterThanOrderByMatchScoreDesc(Double score);

    // Find jobs by source
    List<Job> findBySource(String source);
    // NEW: Check if job URL already exists (avoid duplicates)
    Optional<Job> findBySourceUrl(String sourceUrl);
}