package com.freelance.demo.service;

import com.freelance.demo.entity.Job;
import com.freelance.demo.repository.JobRepository;
import com.freelance.demo.repository.ProposalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;

import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ProposalRepository proposalRepository;

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {

        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public Job updateJob(Long id, Job updatedJob) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        job.setTitle(updatedJob.getTitle());
        job.setDescription(updatedJob.getDescription());
        job.setBudget(updatedJob.getBudget());
        job.setRequiredSkills(updatedJob.getRequiredSkills());

        return jobRepository.save(job);
    }

    public void deleteJob(Long id) {

        jobRepository.deleteById(id);
    }

    public List<Job> getJobsForUser(
            String email,
            String role
    ) {

        // CLIENT
        if (role.equals("CLIENT")) {

            return jobRepository
                    .findByPostedBy_Email(email);
        }

        // FREELANCER
        return jobRepository.findAll();
    }

    public Page<Job> getPaginatedJobs(

            int page,

            int size,

            String search
    ) {

        Pageable pageable =
                PageRequest.of(page, size);

        if (
                search != null &&
                        !search.isBlank()
        ) {

            return jobRepository
                    .findByTitleContainingIgnoreCase(
                            search,
                            pageable
                    );
        }

        return jobRepository.findAll(
                pageable
        );
    }

    public Page<Job> getJobs(

            int page,

            int size,

            String search,

            String budget,

            String sort,

            String email,

            String role

    ) {

        Pageable pageable;

        // SORTING
        if ("budget".equals(sort)) {

            pageable = PageRequest.of(

                    page,

                    size,

                    Sort.by("budget")
                            .descending()
            );

        } else {

            pageable = PageRequest.of(
                    page,
                    size
            );
        }

        // DYNAMIC FILTERS
        Specification<Job> specification =
                (root, query, criteriaBuilder) -> {

                    List<Predicate> predicates =
                            new ArrayList<>();

                    // ONLY ACTIVE JOBS
                    if (role.equals("CLIENT")) {

                        predicates.add(

                                criteriaBuilder.equal(

                                        root.get("postedBy")
                                                .get("email"),

                                        email
                                )
                        );
                    }

                    // SEARCH
                    if (
                            search != null &&
                                    !search.isBlank()
                    ) {

                        predicates.add(

                                criteriaBuilder.like(

                                        criteriaBuilder.lower(
                                                root.get("title")
                                        ),

                                        "%" +
                                                search.toLowerCase()
                                                + "%"
                                )
                        );
                    }

                    // BUDGET FILTER
                    if (
                            budget != null &&
                                    !budget.equals("all")
                    ) {

                        if (
                                budget.equals("starter")
                        ) {

                            predicates.add(

                                    criteriaBuilder.lessThan(
                                            root.get("budget"),
                                            10000.0
                                    )
                            );

                        } else if (
                                budget.equals("growth")
                        ) {

                            predicates.add(

                                    criteriaBuilder.between(

                                            root.get("budget"),

                                            10000.0,

                                            50000.0
                                    )
                            );

                        } else if (
                                budget.equals("premium")
                        ) {

                            predicates.add(

                                    criteriaBuilder.greaterThan(

                                            root.get("budget"),

                                            50000.0
                                    )
                            );
                        }
                    }

                    return criteriaBuilder.and(

                            predicates.toArray(
                                    new Predicate[0]
                            )
                    );
                };

        Page<Job> jobsPage =


                jobRepository.findAll(
                        specification,
                        pageable
                );


        // ONLY FOR FREELANCER
        if (role.equals("FREELANCER")) {

            List<Long> appliedJobIds =

                    proposalRepository
                            .findByFreelancer_Email(email)
                            .stream()

                            .map(
                                    proposal ->

                                            proposal
                                                    .getJob()
                                                    .getId()
                            )

                            .toList();

            List<Job> filteredJobs =

                    jobsPage

                            .getContent()
                            .stream()

                            .filter(job ->

                                    !appliedJobIds.contains(
                                            job.getId()
                                    )
                            )

                            .toList();

            return new PageImpl<>(

                    filteredJobs,

                    pageable,

                    filteredJobs.size()
            );
        }


        return jobsPage;
    }

    public Job toggleJobStatus(

            Long jobId,

            String email
    ) {

        Job job =

                jobRepository
                        .findById(jobId)
                        .orElseThrow(

                                () -> new RuntimeException(
                                        "Job not found"
                                )
                        );

        // OWNER CHECK
        if (

                !job.getPostedBy()
                        .getEmail()
                        .equals(email)

        ) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        job.setActive(
                !job.isActive()
        );

        return jobRepository.save(job);
    }


}