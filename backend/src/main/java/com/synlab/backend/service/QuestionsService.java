package com.synlab.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class QuestionsService {

    private static final Logger log = LoggerFactory.getLogger(QuestionsService.class);
    private static final String QUESTIONS_FILE_PATH = "questions.json";

    public String getAllQuestions() throws IOException {
        log.info("Loading questions from {}", QUESTIONS_FILE_PATH);
        ClassPathResource resource = new ClassPathResource(QUESTIONS_FILE_PATH);
        String questionsJson = resource.getContentAsString(StandardCharsets.UTF_8);
        log.info("Questions loaded successfully");
        return questionsJson;
    }
}
