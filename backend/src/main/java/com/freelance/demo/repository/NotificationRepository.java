package com.freelance.demo.repository;

import com.freelance.demo.entity.Notification;

import com.freelance.demo.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification>
    findByUserOrderByIdDesc(
            User user
    );
}