package com.freelance.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.*;
import com.freelance.demo.validation.ValidPassword;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")

public class User {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )

    private Long id;

    @NotBlank(
            message = "Name is required"
    )
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Email(
            message = "Invalid email format"
    )

    @NotBlank(
            message = "Email is required"
    )
    private String email;

    @NotBlank(
            message = "Password is required"
    )
    @ValidPassword
    private String password;

    private Boolean online = false;

    @NotBlank(
            message = "Role is required"
    )

    private String role;

    @NotBlank(
            message = "Skills are required"
    )

    private String skills;

    private Double rating;

    @OneToMany(
            mappedBy = "freelancer"
    )

    @JsonIgnore
    private List<Proposal> proposals;

    private LocalDateTime lastSeen;

    @Column(length = 1000)
    private String bio;

    private String profileImage;

    private String experience;

    private String portfolioLink;

    private Double hourlyRate;


    private String title;
}