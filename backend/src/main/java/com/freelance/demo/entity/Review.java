package com.freelance.demo.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity

public class Review {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;

    private Integer rating;

    @Column(length = 1000)
    private String comment;

    private LocalDateTime createdAt =
            LocalDateTime.now();

    // REVIEWER
    @ManyToOne
    private User reviewer;

    // REVIEWED USER
    @ManyToOne
    private User reviewedUser;

    @OneToOne
    private Contract contract;

    // GETTERS & SETTERS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }

    public User getReviewer() {
        return reviewer;
    }

    public void setReviewer(
            User reviewer
    ) {
        this.reviewer = reviewer;
    }

    public User getReviewedUser() {
        return reviewedUser;
    }

    public void setReviewedUser(
            User reviewedUser
    ) {
        this.reviewedUser = reviewedUser;
    }

    public Contract getContract() {
        return contract;
    }

    public void setContract(
            Contract contract
    ) {
        this.contract = contract;
    }
}