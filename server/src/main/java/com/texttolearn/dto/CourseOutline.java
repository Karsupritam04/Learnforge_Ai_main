package com.texttolearn.dto;

import java.util.List;

/** Shape returned by the AI/rule-based generator for Milestone 8 (generateCoursePrompt). */
public class CourseOutline {
    private String title;
    private String description;
    private List<String> tags;
    private List<ModuleOutline> modules;

    public CourseOutline() {}

    public CourseOutline(String title, String description, List<String> tags, List<ModuleOutline> modules) {
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.modules = modules;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public List<ModuleOutline> getModules() { return modules; }
    public void setModules(List<ModuleOutline> modules) { this.modules = modules; }

    public static class ModuleOutline {
        private String title;
        private List<String> lessonTitles;

        public ModuleOutline() {}
        public ModuleOutline(String title, List<String> lessonTitles) {
            this.title = title;
            this.lessonTitles = lessonTitles;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public List<String> getLessonTitles() { return lessonTitles; }
        public void setLessonTitles(List<String> lessonTitles) { this.lessonTitles = lessonTitles; }
    }
}
