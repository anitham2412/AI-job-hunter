package com.ai.jobhunter.backend.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AppConfig {

    // General WebClient
    @Bean
    public WebClient webClient() {
        return WebClient.builder().build();
    }

    // Gemini WebClient with correct base URL
//    @Bean("geminiWebClient")
//    public WebClient geminiWebClient() {
//        return WebClient.builder()
//                .baseUrl("https://generativelanguage.googleapis.com")  // ✅ hardcoded
//                //.header("Content-Type", "application/json")
//                .build();
    //✅ geminiWebClient REMOVED from here — it lives in GeminiConfig.java

}