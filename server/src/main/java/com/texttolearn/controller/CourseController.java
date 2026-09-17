package com.texttolearn.controller;

import com.texttolearn.dto.CourseDetailResponse;
import com.texttolearn.exception.ResourceNotFoundException;
import com.texttolearn.model.Course;
import com.texttolearn.model.CourseModule;
import com.texttolearn.model.Lesson;
import com.texttolearn.repository.CourseRepository;
import com.texttolearn.repository.LessonRepository;
import com.texttolearn.repository.ModuleRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CourseController {

    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    public CourseController(CourseRepository courseRepository, ModuleRepository moduleRepository, LessonRepository lessonRepository) {
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
    }

    /** Home page course listing. */
    @GetMapping("/courses")
    public List<Course> listCourses() {
        return courseRepository.findAll();
    }

    /** Milestone 4: courses saved by the currently authenticated user. */
    @GetMapping("/user-courses")
    public List<Course> myCourses(Authentication authentication) {
        String creator = (authentication != null) ? authentication.getName() : "anonymous";
        return courseRepository.findByCreator(creator);
    }

    /** Course overview page: course + modules + lesson stubs (titles only, content loads on demand). */
    @GetMapping("/courses/{courseId}")
    public CourseDetailResponse getCourse(@PathVariable String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        List<CourseDetailResponse.ModuleWithLessons> modules = new ArrayList<>();
        for (CourseModule module : moduleRepository.findByCourseId(courseId)) {
            List<Lesson> lessons = lessonRepository.findByModuleId(module.getId());
            modules.add(new CourseDetailResponse.ModuleWithLessons(module, lessons));
        }

        return new CourseDetailResponse(course, modules);
    }

    @DeleteMapping("/courses/{courseId}")
    public void deleteCourse(@PathVariable String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        for (CourseModule module : moduleRepository.findByCourseId(courseId)) {
            lessonRepository.deleteAll(lessonRepository.findByModuleId(module.getId()));
        }
        moduleRepository.deleteAll(moduleRepository.findByCourseId(courseId));
        courseRepository.delete(course);
    }
}
