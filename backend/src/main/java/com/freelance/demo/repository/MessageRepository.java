package com.freelance.demo.repository;

import com.freelance.demo.entity.Message;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository
        extends JpaRepository<Message, Long> {

    List<Message>
    findByContract_IdOrderBySentAtAsc(
            Long contractId
    );

    long countByReceiver_IdAndIsReadFalse(
            Long receiverId
    );

    long countByReceiver_IdAndSender_IdAndIsReadFalse(

            Long receiverId,

            Long senderId
    );

    List<Message>
    findDistinctBySender_IdOrReceiver_Id(

            Long senderId,

            Long receiverId
    );

    List<Message>
    findByReceiver_IdAndSender_IdAndIsReadFalse(

            Long receiverId,

            Long senderId
    );
}