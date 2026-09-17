package com.texttolearn.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "courses")
public class Course {

    @Id
    private String id;

    private String title;
    private String description;

    /** Auth0 `sub` of the creator; "anonymous" when Auth0 isn't configured yet */
    @Indexed
    private String creator;

    /** Ordered module ids belonging to this course */
    private List<String> moduleIds;

    private List<String> tags;

    @CreatedDate
    private Instant createdAt;

    public Course() {}

    public Course(String title, String description, String creator, List<String> moduleIds, List<String> tags) {
        this.title = title;
        this.description = description;
        this.creator = creator;
        this.moduleIds = moduleIds;
        this.tags = tags;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCreator() { return creator; }
    public void setCreator(String creator) { this.creator = creator; }
    public List<String> getModuleIds() { return moduleIds; }
    public void setModuleIds(List<String> moduleIds) { this.moduleIds = moduleIds; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public Instant getCreatedAt() { return createdAt; }
}
