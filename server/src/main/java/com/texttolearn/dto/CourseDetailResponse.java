package com.texttolearn.dto;

import com.texttolearn.model.Course;
import com.texttolearn.model.CourseModule;
import com.texttolearn.model.Lesson;

import java.util.List;

/** Full course tree (course -> modules -> lesson stubs) rendered by the syllabus page. */
public class CourseDetailResponse {
    private Course course;
    private List<ModuleWithLessons> modules;

    public CourseDetailResponse() {}
    public CourseDetailResponse(Course course, List<ModuleWithLessons> modules) {
        this.course = course;
        this.modules = modules;
    }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
    public List<ModuleWithLessons> getModules() { return modules; }
    public void setModules(List<ModuleWithLessons> modules) { this.modules = modules; }

    public static class ModuleWithLessons {
        private CourseModule module;
        private List<Lesson> lessons;

        public ModuleWithLessons() {}
        public ModuleWithLessons(CourseModule module, List<Lesson> lessons) {
            this.module = module;
            this.lessons = lessons;
        }

        public CourseModule getModule() { return module; }
        public void setModule(CourseModule module) { this.module = module; }
        public List<Lesson> getLessons() { return lessons; }
        public void setLessons(List<Lesson> lessons) { this.lessons = lessons; }
    }
}
