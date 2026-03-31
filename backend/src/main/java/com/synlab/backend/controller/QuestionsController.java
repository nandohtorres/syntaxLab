package com.synlab.backend.controller;

import com.synlab.backend.service.QuestionsService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class QuestionsController {

    private final QuestionsService questionsService;

    public QuestionsController(QuestionsService questionsService) {
        this.questionsService = questionsService;
    }

    @GetMapping("/questions")
    public ResponseEntity<String> getAllQuestions() throws IOException {
        String questionsJson = questionsService.getAllQuestions();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(questionsJson);
    }
}
