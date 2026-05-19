package com.freelance.demo.service;

import com.freelance.demo.entity.Notification;
import com.freelance.demo.entity.User;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.freelance.demo.repository.NotificationRepository;
import com.freelance.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class NotificationService {

    @Autowired
    private NotificationRepository
            notificationRepository;

    @Autowired
    private UserRepository
            userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // CREATE
    public void createNotification(

            User user,

            String message
    ) {

        Notification notification =
                new Notification();

        notification.setUser(user);

        notification.setMessage(message);

        notificationRepository
                .save(notification);

        messagingTemplate.convertAndSend(

                "/topic/notifications/" +

                        user.getId(),

                notification
        );
    }

    // GET USER NOTIFICATIONS
    public List<Notification>
    getUserNotifications(
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        return notificationRepository
                .findByUserOrderByIdDesc(
                        user
                );
    }
}