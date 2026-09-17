package com.texttolearn.repository;

import com.texttolearn.model.CourseModule;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ModuleRepository extends MongoRepository<CourseModule, String> {
    List<CourseModule> findByCourseId(String courseId);
}
