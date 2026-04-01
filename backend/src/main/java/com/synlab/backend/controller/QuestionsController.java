package com.synlab.backend.controller;

import com.synlab.backend.model.Question;
import com.synlab.backend.service.QuestionsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Questions", description = "Retrieve learning questions")
public class QuestionsController {

    private final QuestionsService questionsService;

    public QuestionsController(QuestionsService questionsService) {
        this.questionsService = questionsService;
    }

    @Operation(summary = "Get all questions", description = "Returns all 30 Python learning questions grouped by topic")
    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok()
                .header("Cache-Control", "max-age=3600, public")
                .body(questionsService.getAllQuestions());
    }
}
