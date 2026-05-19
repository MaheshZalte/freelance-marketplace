package com.freelance.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicProfileResponseDTO {

    private Long id;

    private String name;

    private String email;

    private String role;

    private String title;

    private String skills;

    private String bio;

    private String experience;

    private String portfolioLink;

    private Double hourlyRate;

    private Double rating;

    private String profileImage;

    private Long reviewCount;

    private Double avgReviewRating;
}

