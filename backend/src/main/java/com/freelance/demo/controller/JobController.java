package com.freelance.demo.controller;

import com.freelance.demo.entity.Job;
import com.freelance.demo.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Page;
import com.freelance.demo.repository.UserRepository;

import com.freelance.demo.entity.User;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private UserRepository userRepository;


    @PreAuthorize("hasAuthority('CLIENT')")
    @PostMapping
    public Job createJob(@RequestBody Job job) {

        String email = (String)

                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

// FIND USER
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

// SET USER
        job.setPostedBy(user);

        return jobService.createJob(job);
    }

//    @GetMapping
//    public List<Job> getAllJobs() {
//        return jobService.getAllJobs();
//    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {

        return jobService.getJobById(id);
    }

    @PutMapping("/{id}")
    public Job updateJob(@PathVariable Long id,
                         @Valid @RequestBody Job job) {

        String email = (String)
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        Job existing = jobService.getJobById(id);

        // OWNER CHECK
        if (!existing.getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        return jobService.updateJob(id, job);
    }

    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable Long id) {

        String email = (String)
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        Job existing = jobService.getJobById(id);

        // OWNER CHECK
        if (!existing.getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        jobService.deleteJob(id);

        return "Job deleted successfully";
    }


//    @GetMapping
//
//    public List<Job> getJobsForUser() {
//
//        String email = (String)
//                SecurityContextHolder
//                        .getContext()
//                        .getAuthentication()
//                        .getPrincipal();
//
//        String role =
//                SecurityContextHolder
//                        .getContext()
//                        .getAuthentication()
//                        .getAuthorities()
//                        .iterator()
//                        .next()
//                        .getAuthority();
//
//        return jobService
//                .getJobsForUser(
//                        email,
//                        role
//                );
//    }

    @GetMapping

    public Page<Job> getJobs(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "6")
            int size,

            @RequestParam(defaultValue = "")
            String search,

            @RequestParam(defaultValue = "all")
            String budget,

            @RequestParam(defaultValue = "")
            String sort
    ) {

        String email =

                (String)

                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

        String role =

                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority();

        return jobService.getJobs(

                page,

                size,

                search,

                budget,

                sort,

                email,

                role
        );
    }


    @PutMapping("/{jobId}/toggle")

    public Job toggleJob(

            @PathVariable
            Long jobId
    ) {

        String email =

                (String)

                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

        return jobService
                .toggleJobStatus(

                        jobId,

                        email
                );
    }


}
