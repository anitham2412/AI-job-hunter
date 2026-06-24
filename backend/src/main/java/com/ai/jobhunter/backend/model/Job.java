package com.ai.jobhunter.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;               // "Java Developer"

    @Column(nullable = false)
    private String company;             // "Google"

    @Column(columnDefinition = "TEXT")
    private String description;         // Full job description text

    private String location;            // "Hyderabad" or "Remote"

    @Column(columnDefinition = "TEXT")
    private String skillsRequired;      // "Java, Spring Boot, AWS"

    private String sourceUrl;           // Link to the original job post

    private String source;              // "LinkedIn", "Naukri", "Indeed"

    private Double matchScore;          // 0.0 to 100.0 — AI calculated

    @Column(name = "fetched_at")
    private LocalDateTime fetchedAt;

    @PrePersist
    public void prePersist() {
        this.fetchedAt = LocalDateTime.now();
    }
}