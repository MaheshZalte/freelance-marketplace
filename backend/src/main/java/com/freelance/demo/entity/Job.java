package com.freelance.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title required")
    private String title;

    @NotBlank(message = "Description required")
    private String description;

    @NotNull(message = "Budget required")

    @Positive(message = "Budget must be positive")

    private Double budget;

    @NotBlank(message = "Skills required")
    private String requiredSkills;

//    private User postedBy; // email of client

    @ManyToOne
    @JoinColumn(name = "client_id")
    private User postedBy;

    @OneToMany(mappedBy = "job")
    @JsonIgnore
    private List<Proposal> proposals;

    private boolean active = true;
}