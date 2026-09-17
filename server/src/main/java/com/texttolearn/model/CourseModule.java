package com.texttolearn.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * Named CourseModule (instead of "Module") to avoid clashing with java.lang.Module.
 */
@Document(collection = "modules")
public class CourseModule {

    @Id
    private String id;

    private String title;

    @Indexed
    private String courseId;

    /** Ordered lesson ids belonging to this module */
    private List<String> lessonIds;

    public CourseModule() {}

    public CourseModule(String title, String courseId, List<String> lessonIds) {
        this.title = title;
        this.courseId = courseId;
        this.lessonIds = lessonIds;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    public List<String> getLessonIds() { return lessonIds; }
    public void setLessonIds(List<String> lessonIds) { this.lessonIds = lessonIds; }
}
