package com.freelance.demo.service;

import com.freelance.demo.entity.User;

import com.freelance.demo.repository.*;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.*;

@Service

public class DashboardService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object>
    getDashboardStats(
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        Map<String, Object>
                stats =
                new HashMap<>();

        // JOBS
        Long jobs =
                jobRepository
                        .countByPostedBy_Email(
                                email
                        );

        // PROPOSALS
        Long proposals =
                proposalRepository
                        .countByFreelancer(user);

        // CONTRACTS
        Long contracts =
                contractRepository
                        .countByFreelancer(user);

        // EARNINGS
        Double earnings =
                Optional.ofNullable(

                        paymentRepository
                                .getTotalEarningsByFreelancer(
                                        user
                                )

                ).orElse(0.0);

        stats.put(
                "jobs",
                jobs
        );

        stats.put(
                "proposals",
                proposals
        );

        stats.put(
                "contracts",
                contracts
        );

        stats.put(
                "earnings",
                earnings
        );

        return stats;
    }
}