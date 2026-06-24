package com.ai.jobhunter.backend.repository;

import com.ai.jobhunter.backend.model.Application;  // ✅ fixed
import com.ai.jobhunter.backend.model.User;          // ✅ fixed
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // Get all applications for a specific user
    List<Application> findByUser(User user);

    // Get applications by status
    List<Application> findByUserAndStatus(User user, Application.ApplicationStatus status);
}