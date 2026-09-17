package com.texttolearn.repository;

import com.texttolearn.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByCreator(String creator);
}
