package com.freelance.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "contracts")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // JOB
    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    // ACCEPTED PROPOSAL
    @OneToOne
    @JoinColumn(name = "proposal_id")
    private Proposal proposal;

    // FREELANCER
    @ManyToOne
    @JoinColumn(name = "freelancer_id")
    private User freelancer;

    // CLIENT
    @ManyToOne
    @JoinColumn(name = "client_id")
    private User client;

    private Double amount;

    private String status; // ACTIVE, COMPLETED
}