package com.texttolearn.service;

import com.texttolearn.dto.CourseOutline;
import com.texttolearn.dto.LessonGenerationResult;

/**
 * Milestone 8: AI Prompt Design.
 * Any generation backend (rule-based template engine, OpenAI, Hugging Face, etc.) implements
 * this contract. Swap implementations by setting ai.provider in application.properties.
 */
public interface AiCourseGeneratorService {

    /** generateCoursePrompt(topic) -> title, description, tags, modules[] with lesson titles */
    CourseOutline generateCourseOutline(String topic);

    /** generateLessonPrompt(course, module, lesson) -> objectives + structured content blocks */
    LessonGenerationResult generateLessonContent(String courseTitle, String moduleTitle, String lessonTitle);
}
