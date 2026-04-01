package com.synlab.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.synlab.backend.model.Question;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class QuestionsService {

    private static final Logger log = LoggerFactory.getLogger(QuestionsService.class);
    private static final String QUESTIONS_FILE_PATH = "questions.json";

    private final ObjectMapper objectMapper;
    private List<Question> cachedQuestions;

    public QuestionsService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void loadAndValidateQuestions() throws IOException {
        log.info("Loading and validating questions from {}", QUESTIONS_FILE_PATH);
        ClassPathResource resource = new ClassPathResource(QUESTIONS_FILE_PATH);
        try (InputStream inputStream = resource.getInputStream()) {
            List<Question> questions = objectMapper.readValue(inputStream, new TypeReference<>() {});
            validateQuestions(questions);
            cachedQuestions = List.copyOf(questions);
        }
        log.info("Loaded and validated {} questions successfully", cachedQuestions.size());
    }

    public List<Question> getAllQuestions() {
        return cachedQuestions;
    }

    private void validateQuestions(List<Question> questions) {
        if (questions == null || questions.isEmpty()) {
            throw new IllegalStateException("questions.json is empty or could not be parsed");
        }
        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            String context = "Question at index " + i + " (id=" + question.id() + ")";

            if (question.id() <= 0) {
                throw new IllegalStateException(context + ": id must be a positive integer");
            }
            requireNonBlank(question.group(), context, "group");
            if (question.order() <= 0) {
                throw new IllegalStateException(context + ": order must be a positive integer");
            }
            requireNonBlank(question.title(), context, "title");
            requireNonBlank(question.prompt(), context, "prompt");
            if (question.starterCode() == null) {
                throw new IllegalStateException(context + ": starterCode must not be null");
            }
            if (question.tests() == null || question.tests().isEmpty()) {
                throw new IllegalStateException(context + ": tests must not be null or empty");
            }
            requireNonBlank(question.answer(), context, "answer");
        }
    }

    private void requireNonBlank(String value, String context, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(context + ": " + fieldName + " must not be blank");
        }
    }
}
