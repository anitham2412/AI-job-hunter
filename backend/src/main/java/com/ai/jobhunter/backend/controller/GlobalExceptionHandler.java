package com.ai.jobhunter.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice   // Handles exceptions across ALL controllers
public class GlobalExceptionHandler {

    // ─── HANDLE RUNTIME EXCEPTIONS ────────────────────────
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(
            RuntimeException ex) {

        Map<String, Object> error = new HashMap<>();
        error.put("status",    "error");
        error.put("message",   ex.getMessage());
        error.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error);
    }

    // ─── HANDLE ALL OTHER EXCEPTIONS ──────────────────────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(
            Exception ex) {

        Map<String, Object> error = new HashMap<>();
        error.put("status",    "error");
        error.put("message",   "Something went wrong!");
        error.put("details",   ex.getMessage());
        error.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }
}
