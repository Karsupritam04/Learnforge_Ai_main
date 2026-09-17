package com.texttolearn.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.Instant;
import java.util.List;

@Document(collection = "lessons")
public class Lesson {

    @Id
    private String id;

    private String title;

    /** Learning objectives for the lesson, e.g. ["Understand X", "Identify Y"] */
    private List<String> objectives;

    /** Ordered, structured content blocks (heading / paragraph / code / video / mcq) */
    private List<ContentBlock> content;

    /** True once AI-generated content has been produced for this lesson */
    private boolean isEnriched = false;

    @Indexed
    private String moduleId;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Lesson() {}

    public Lesson(String title, List<String> objectives, List<ContentBlock> content, String moduleId) {
        this.title = title;
        this.objectives = objectives;
        this.content = content;
        this.moduleId = moduleId;
        this.isEnriched = content != null && !content.isEmpty();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public List<String> getObjectives() { return objectives; }
    public void setObjectives(List<String> objectives) { this.objectives = objectives; }
    public List<ContentBlock> getContent() { return content; }
    public void setContent(List<ContentBlock> content) { this.content = content; }
    public boolean isEnriched() { return isEnriched; }
    public void setEnriched(boolean enriched) { isEnriched = enriched; }
    public String getModuleId() { return moduleId; }
    public void setModuleId(String moduleId) { this.moduleId = moduleId; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
