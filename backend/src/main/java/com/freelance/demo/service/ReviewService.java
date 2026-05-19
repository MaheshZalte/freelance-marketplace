package com.freelance.demo.service;

import com.freelance.demo.entity.*;

import com.freelance.demo.repository.*;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private UserRepository userRepository;

    public Review createReview(

            Long contractId,

            Review review
    ) {

        String email =

                (String)

                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

        User reviewer =

                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        Contract contract =

                contractRepository
                        .findById(contractId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Contract not found"
                                )
                        );

        review.setReviewer(
                reviewer
        );

        review.setContract(
                contract
        );

        // REVIEW FREELANCER
        review.setReviewedUser(
                contract.getFreelancer()
        );

        return reviewRepository
                .save(review);
    }

    public List<Review>
    getReviewsForUser(
            String email
    ) {

        return reviewRepository
                .findByReviewedUser_Email(
                        email
                );
    }
}