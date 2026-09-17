package com.texttolearn.controller;

import com.texttolearn.exception.ResourceNotFoundException;
import com.texttolearn.model.Lesson;
import com.texttolearn.repository.LessonRepository;
import com.texttolearn.service.CourseGenerationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonRepository lessonRepository;
    private final CourseGenerationService courseGenerationService;

    public LessonController(LessonRepository lessonRepository, CourseGenerationService courseGenerationService) {
        this.lessonRepository = lessonRepository;
        this.courseGenerationService = courseGenerationService;
    }

    /**
     * Lesson viewer page. If the lesson hasn't been AI-enriched yet (isEnriched == false),
     * this generates and persists its content on the fly, so the frontend can always just GET
     * a lesson id and render whatever comes back.
     */
    @GetMapping("/{lessonId}")
    public Lesson getLesson(@PathVariable String lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + lessonId));

        if (!lesson.isEnriched()) {
            return courseGenerationService.enrichLesson(lessonId);
        }
        return lesson;
    }
}
