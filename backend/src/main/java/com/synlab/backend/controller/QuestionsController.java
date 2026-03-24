package com.synlab.backend.controller;

import com.synlab.backend.model.ErrorResponse;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api")
public class QuestionsController {

    private static final String QUESTIONS_FILE_PATH = "questions.json";

    @GetMapping("/questions")
    public ResponseEntity<?> getAllQuestions() {
        try {
            ClassPathResource questionsResource = new ClassPathResource(QUESTIONS_FILE_PATH);
            String questionsJson = questionsResource.getContentAsString(StandardCharsets.UTF_8);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(questionsJson);
        } catch (IOException e) {
            ErrorResponse errorResponse = ErrorResponse.of(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Failed to load questions — please try again later"
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
