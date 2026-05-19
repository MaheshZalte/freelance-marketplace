package com.freelance.demo.service;

import com.freelance.demo.dto.MessageRequestDTO;

import com.freelance.demo.entity.*;

import com.freelance.demo.repository.*;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;

import com.freelance.demo.dto.ConversationDTO;

import java.util.*;

@Service

public class MessageService {

    @Autowired
    private MessageRepository
            messageRepository;

    @Autowired
    private UserRepository
            userRepository;

    @Autowired
    private ContractRepository
            contractRepository;

    // SEND MESSAGE
    public Message sendMessage(

            String senderEmail,

            MessageRequestDTO request
    ) {

        User sender =
                userRepository
                        .findByEmail(senderEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sender not found"
                                ));

        User receiver =
                userRepository
                        .findById(
                                request.getReceiverId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Receiver not found"
                                ));

        Contract contract =
                contractRepository
                        .findById(
                                request.getContractId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Contract not found"
                                ));

        Message message =
                new Message();

        message.setSender(sender);

        message.setReceiver(receiver);

        message.setContract(contract);

        message.setContent(
                request.getContent()
        );

        message.setSentAt(
                LocalDateTime.now()
        );

        message.setCreatedAt(
                LocalDateTime.now()
        );

        return messageRepository
                .save(message);
    }

    // GET CONTRACT CHAT
    public List<Message>
    getMessagesByContract(
            Long contractId
    ) {

        return messageRepository
                .findByContract_IdOrderBySentAtAsc(
                        contractId
                );
    }

    public List<ConversationDTO>
    getConversations(
            String email
    ) {

        User currentUser =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        List<Message> messages =
                messageRepository
                        .findDistinctBySender_IdOrReceiver_Id(

                                currentUser.getId(),

                                currentUser.getId()
                        );

        Map<Long, ConversationDTO>
                conversations =
                new LinkedHashMap<>();

        for (Message message : messages) {

            User otherUser;

            if (
                    message.getSender()
                            .getId()
                            .equals(
                                    currentUser.getId()
                            )
            ) {

                otherUser =
                        message.getReceiver();

            } else {

                otherUser =
                        message.getSender();
            }

            Long unreadCount =
                    messageRepository
                            .countByReceiver_IdAndSender_IdAndIsReadFalse(

                                    currentUser.getId(),

                                    otherUser.getId()
                            );

            conversations.put(

                    otherUser.getId(),

                    new ConversationDTO(

                            message
                                    .getContract()
                                    .getId(),

                            otherUser.getId(),

                            otherUser.getName(),

                            message.getContent(),

                            unreadCount,

                            otherUser.getOnline()
                    )
            );
        }

        return new ArrayList<>(
                conversations.values()
        );
    }

    public void markMessagesAsRead(

            Long receiverId,

            Long senderId
    ) {

        List<Message> unreadMessages =

                messageRepository
                        .findByReceiver_IdAndSender_IdAndIsReadFalse(

                                receiverId,

                                senderId
                        );

        for (Message message : unreadMessages) {

            message.setRead(true);
        }

        messageRepository.saveAll(
                unreadMessages
        );
    }
}
