package com.freelance.demo.repository;

import com.freelance.demo.entity.Job;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface JobRepository
        extends JpaRepository<Job, Long>,
        JpaSpecificationExecutor<Job> {

    List<Job> findByPostedBy_Email(
            String email
    );

    Page<Job> findByTitleContainingIgnoreCase(
            String title,
            Pageable pageable
    );

    Long countByPostedBy_Email(
            String email
    );
}