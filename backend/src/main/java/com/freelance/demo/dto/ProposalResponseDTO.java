package com.freelance.demo.dto;

import lombok.Data;

@Data
public class ProposalResponseDTO {

    private Long proposalId;

    private String proposalText;

    private Double bidAmount;

    private String status;

    // Freelancer Details
    private Long freelancerId;

    private String freelancerName;

    private String freelancerEmail;

    private String freelancerBio;

    private String freelancerTitle;

    private String freelancerSkills;

    private String freelancerProfileImage;
}