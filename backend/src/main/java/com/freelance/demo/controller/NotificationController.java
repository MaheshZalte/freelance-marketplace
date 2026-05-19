package com.freelance.demo.controller;

import com.freelance.demo.entity.Notification;

import com.freelance.demo.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/notifications")

public class NotificationController {

    @Autowired
    private NotificationService
            notificationService;

    @GetMapping

    public List<Notification>
    getNotifications() {

        String email =
                (String)
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

        return notificationService
                .getUserNotifications(
                        email
                );
    }
}