package com.texttolearn.repository;

import com.texttolearn.model.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LessonRepository extends MongoRepository<Lesson, String> {
    List<Lesson> findByModuleId(String moduleId);
}
