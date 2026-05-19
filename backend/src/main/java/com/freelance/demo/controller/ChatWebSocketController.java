package com.freelance.demo.controller;

import com.freelance.demo.entity.Message;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(
            SimpMessagingTemplate messagingTemplate
    ) {

        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(
            @Payload Message message
    ) {

        messagingTemplate.convertAndSend(
                "/topic/chat/" +
                        message.getContract().getId(),
                message
        );
    }

    @MessageMapping("/chat.typing")
    public void typing(
            @Payload Map<String, Object> payload
    ) {

        String contractId =
                payload
                        .get("contractId")
                        .toString();

        messagingTemplate.convertAndSend(
                "/topic/typing/" + contractId,
                (Object) payload
        );
    }
}