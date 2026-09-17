package com.texttolearn.service;

import com.texttolearn.dto.CourseOutline;
import com.texttolearn.dto.LessonGenerationResult;
import com.texttolearn.model.Course;
import com.texttolearn.model.CourseModule;
import com.texttolearn.model.Lesson;
import com.texttolearn.repository.CourseRepository;
import com.texttolearn.repository.LessonRepository;
import com.texttolearn.repository.ModuleRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Ties Milestone 8 (AI prompt design) to Milestone 5 (persistence).
 *
 * Course generation is two-phase:
 *  1) generateCourseOutline(topic) -> persists Course + Modules + empty Lesson stubs (fast,
 *     one AI call) so the syllabus renders immediately.
 *  2) enrichLesson(lessonId) -> generates and persists full lesson content the first time a
 *     lesson is actually opened (isEnriched flips false -> true), keeping token usage down.
 */
@Service
public class CourseGenerationService {

    private final AiCourseGeneratorService aiService;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    public CourseGenerationService(AiCourseGeneratorService aiService,
                                    CourseRepository courseRepository,
                                    ModuleRepository moduleRepository,
                                    LessonRepository lessonRepository) {
        this.aiService = aiService;
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
    }

    public Course generateAndPersistCourse(String topic, String creator) {
        CourseOutline outline = aiService.generateCourseOutline(topic);

        Course course = new Course(outline.getTitle(), outline.getDescription(), creator, new ArrayList<>(), outline.getTags());
        course = courseRepository.save(course);

        List<String> moduleIds = new ArrayList<>();
        for (CourseOutline.ModuleOutline moduleOutline : outline.getModules()) {
            CourseModule module = new CourseModule(moduleOutline.getTitle(), course.getId(), new ArrayList<>());
            module = moduleRepository.save(module);

            List<String> lessonIds = new ArrayList<>();
            for (String lessonTitle : moduleOutline.getLessonTitles()) {
                // Lesson stub only - content is generated lazily via enrichLesson()
                Lesson lesson = new Lesson(lessonTitle, List.of(), List.of(), module.getId());
                lesson.setEnriched(false);
                lesson = lessonRepository.save(lesson);
                lessonIds.add(lesson.getId());
            }
            module.setLessonIds(lessonIds);
            moduleRepository.save(module);
            moduleIds.add(module.getId());
        }

        course.setModuleIds(moduleIds);
        return courseRepository.save(course);
    }

    /** Generates and saves full content for a lesson stub the first time it's opened. */
    public Lesson enrichLesson(String lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found: " + lessonId));

        if (lesson.isEnriched()) {
            return lesson;
        }

        CourseModule module = moduleRepository.findById(lesson.getModuleId())
                .orElseThrow(() -> new IllegalStateException("Parent module not found for lesson: " + lessonId));
        Course course = courseRepository.findById(module.getCourseId())
                .orElseThrow(() -> new IllegalStateException("Parent course not found for module: " + module.getId()));

        LessonGenerationResult result = aiService.generateLessonContent(course.getTitle(), module.getTitle(), lesson.getTitle());

        lesson.setObjectives(result.getObjectives());
        lesson.setContent(result.getContent());
        lesson.setEnriched(true);
        return lessonRepository.save(lesson);
    }
}
