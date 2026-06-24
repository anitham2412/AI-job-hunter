package com.ai.jobhunter.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Links to User table
    @ManyToOne                          // Many applications → One user
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Links to Job table
    @ManyToOne                          // Many applications → One job
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)        // Saves enum as text in DB
    private ApplicationStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;               // Personal notes about this job

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    @PrePersist
    public void prePersist() {
        this.appliedAt = LocalDateTime.now();
        this.status = ApplicationStatus.APPLIED; // default status
    }

    // Enum defined inside — tracks the job application lifecycle
    public enum ApplicationStatus {
        SAVED,        // bookmarked, not yet applied
        APPLIED,      // submitted application
        INTERVIEW,    // got interview call
        OFFER,        // received offer
        REJECTED      // rejected
    }
}