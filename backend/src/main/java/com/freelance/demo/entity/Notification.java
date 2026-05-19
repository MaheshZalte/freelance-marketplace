package com.freelance.demo.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

@Table(name = "notifications")

public class Notification {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )

    private Long id;

    private String message;

    private boolean isRead = false;

    // RECEIVER
    @ManyToOne

    @JoinColumn(name = "user_id")

    private User user;
}