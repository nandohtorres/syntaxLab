package com.synlab.backend;

import com.synlab.backend.service.QuestionsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class SynlabBackendApplicationTests {

    @Autowired
    private QuestionsService questionsService;

    @Test
    void contextLoads() {
    }

    @Test
    void questionsAreLoadedAndValid() {
        assertThat(questionsService.getAllQuestions())
                .isNotEmpty()
                .allSatisfy(q -> {
                    assertThat(q.id()).isPositive();
                    assertThat(q.title()).isNotBlank();
                    assertThat(q.tests()).isNotEmpty();
                });
    }
}
