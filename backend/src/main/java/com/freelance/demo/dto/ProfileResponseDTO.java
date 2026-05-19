package com.freelance.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ProfileResponseDTO {

    private String name;

    private String email;

    private String role;

    private String skills;

    private String bio;

    private String experience;

    private String portfolioLink;

    // keep as String so frontend can safely render without type errors
    private String hourlyRate;

    private String profileImage;
}
