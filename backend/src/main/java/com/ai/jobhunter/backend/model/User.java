package com.ai.jobhunter.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data                    // Lombok: auto-generates getters, setters, toString
@Entity                  // Tells Spring: "This class = a database table"
@Table(name = "users")   // The actual table name in PostgreSQL
public class User {

    @Id                                    // This is the Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment ID
    private Long id;

    @Column(nullable = false)              // This column cannot be empty
    private String name;

    @Column(nullable = false, unique = true)  // Email must be unique
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(columnDefinition = "TEXT")     // Large text field for full resume
    private String resumeText;

    @Column(columnDefinition = "TEXT")     // Comma-separated skills
    private String skills;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist                            // Runs automatically before saving
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}