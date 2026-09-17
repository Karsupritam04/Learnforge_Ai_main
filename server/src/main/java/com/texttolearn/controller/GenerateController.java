package com.texttolearn.controller;

import com.texttolearn.dto.PromptRequest;
import com.texttolearn.model.Course;
import com.texttolearn.model.Lesson;
import com.texttolearn.service.CourseGenerationService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class GenerateController {

    private final CourseGenerationService courseGenerationService;

    public GenerateController(CourseGenerationService courseGenerationService) {
        this.courseGenerationService = courseGenerationService;
    }

    /** Milestones 1 + 8: turn a free-form topic prompt into a persisted course outline. */
    @PostMapping("/generate-course")
    public Course generateCourse(@Valid @RequestBody PromptRequest request, Authentication authentication) {
        String creator = (authentication != null) ? authentication.getName() : "anonymous";
        return courseGenerationService.generateAndPersistCourse(request.getTopic(), creator);
    }

    /** Lazily generates full content for a single lesson stub the first time it's opened. */
    @PostMapping("/generate-lesson/{lessonId}")
    public Lesson generateLesson(@PathVariable String lessonId) {
        return courseGenerationService.enrichLesson(lessonId);
    }
}
