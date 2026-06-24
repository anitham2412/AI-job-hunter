package com.ai.jobhunter.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String model;

    public String sendPrompt(String systemPrompt, String userPrompt) {

        WebClient client = WebClient.create();

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "temperature", 0.3,
                "max_tokens", 500,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userPrompt)
                )
        );

        log.info("Sending request to Groq with model: {}", model);

        Map response = client.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), clientResponse ->  // ✅ add this
                        clientResponse.bodyToMono(String.class)
                                .doOnNext(body -> log.error("Groq error: {}", body))       // ✅ logs exact error
                                .then(clientResponse.createException())
                )
                .bodyToMono(Map.class)
                .block();

        List choices = (List) response.get("choices");
        Map firstChoice = (Map) choices.get(0);
        Map message = (Map) firstChoice.get("message");
        String result = (String) message.get("content");

        log.info("Groq response received: {}", result);
        return result;
    }
}