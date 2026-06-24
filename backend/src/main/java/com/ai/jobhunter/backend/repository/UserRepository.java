package com.ai.jobhunter.backend.repository;

import com.ai.jobhunter.backend.model.User;  // ✅ fixed
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}