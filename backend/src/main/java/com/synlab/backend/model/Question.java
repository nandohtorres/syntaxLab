package com.synlab.backend.model;

import java.util.List;

public record Question(
        int id,
        String group,
        int order,
        String title,
        String prompt,
        String starterCode,
        List<String> tests,
        String answer,
        String pythonicTip,
        ConceptSummary conceptSummary,
        List<LanguageNote> languageNotes
) {}
