package com.freelance.demo.config;

import com.freelance.demo.entity.User;

import com.freelance.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.event.EventListener;

import org.springframework.messaging.simp.stomp.*;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component

public class WebSocketEventListener {

    @Autowired
    private UserRepository userRepository;

    @EventListener
    public void handleWebSocketConnectListener(

            SessionConnectedEvent event
    ) {
        // no-op (avoid noisy stdout in production)
    }

    @EventListener
    public void handleWebSocketDisconnectListener(

            SessionDisconnectEvent event
    ) {
        // no-op (avoid noisy stdout in production)
    }

}