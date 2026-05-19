package com.freelance.demo.entity;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

@Table(name = "messages")

public class Message {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )

    private Long id;

    private String content;

    private LocalDateTime sentAt;

    private LocalDateTime createdAt;

    // SENDER
    @ManyToOne

    @JoinColumn(name = "sender_id")

    private User sender;

    // RECEIVER
    @ManyToOne

    @JoinColumn(name = "receiver_id")

    private User receiver;

    private boolean isRead = false;

    private String fileUrl;

    private boolean seen = false;

    // CONTRACT
    @ManyToOne

    @JoinColumn(name = "contract_id")

    private Contract contract;
}