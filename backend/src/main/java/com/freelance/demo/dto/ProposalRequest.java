package com.freelance.demo.dto;

public class ProposalRequest {

    private Long jobId;

    private String message;

    private Double bidAmount;

    public Long getJobId() {

        return jobId;
    }

    public void setJobId(Long jobId) {

        this.jobId = jobId;
    }

    public String getMessage() {

        return message;
    }

    public void setMessage(String message) {

        this.message = message;
    }

    public Double getBidAmount() {

        return bidAmount;
    }

    public void setBidAmount(Double bidAmount) {

        this.bidAmount = bidAmount;
    }
}