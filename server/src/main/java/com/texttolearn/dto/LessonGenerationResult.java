package com.texttolearn.dto;

import com.texttolearn.model.ContentBlock;

import java.util.List;

/** Shape returned by the AI/rule-based generator for Milestone 8 (generateLessonPrompt). */
public class LessonGenerationResult {
    private String title;
    private List<String> objectives;
    private List<ContentBlock> content;

    public LessonGenerationResult() {}

    public LessonGenerationResult(String title, List<String> objectives, List<ContentBlock> content) {
        this.title = title;
        this.objectives = objectives;
        this.content = content;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public List<String> getObjectives() { return objectives; }
    public void setObjectives(List<String> objectives) { this.objectives = objectives; }
    public List<ContentBlock> getContent() { return content; }
    public void setContent(List<ContentBlock> content) { this.content = content; }
}
