package com.freelance.demo.dto;

import lombok.Data;

@Data

public class MessageRequestDTO {

    private Long contractId;

    private Long receiverId;

    private String content;
}