package com.freelance.demo.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ConversationDTO {

    private Long contractId;

    private Long userId;

    private String userName;

    private String lastMessage;

    private Long unreadCount;

    private Boolean online;
}
