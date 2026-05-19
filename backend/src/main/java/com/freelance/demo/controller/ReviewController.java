package com.freelance.demo.controller;

import com.freelance.demo.entity.Review;

import com.freelance.demo.service.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")

public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/{contractId}")

    public Review createReview(

            @PathVariable
            Long contractId,

            @RequestBody
            Review review
    ) {

        return reviewService
                .createReview(
                        contractId,
                        review
                );
    }

    @GetMapping

    public List<Review> getMyReviews() {

        String email =

                (String)

                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

        return reviewService
                .getReviewsForUser(
                        email
                );
    }
}