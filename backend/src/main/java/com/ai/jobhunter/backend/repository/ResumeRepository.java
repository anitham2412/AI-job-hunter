package com.ai.jobhunter.backend.repository;

import com.ai.jobhunter.backend.model.Resume;
import com.ai.jobhunter.backend.model.User;
import com.ai.jobhunter.backend.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    // Find tailored resume for a specific user+job combo
    Optional<Resume> findByUserAndJob(User user, Job job);
}