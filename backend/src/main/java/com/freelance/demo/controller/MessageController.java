package com.freelance.demo.controller;

import com.freelance.demo.dto.MessageRequestDTO;

import com.freelance.demo.entity.Message;

import com.freelance.demo.entity.User;
import com.freelance.demo.repository.MessageRepository;
import com.freelance.demo.repository.UserRepository;
import com.freelance.demo.service.MessageService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.freelance.demo.dto.ConversationDTO;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;

@RestController

@RequestMapping("/api/messages")

public class MessageController {

    @Autowired
    private MessageService
            messageService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    // SEND MESSAGE
    @PostMapping

    public Message sendMessage(

            @RequestBody
            MessageRequestDTO request
    ) {

        String email =
                (String)
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

        return messageService
                .sendMessage(
                        email,
                        request
                );
    }

    // GET CHAT
    @GetMapping("/{contractId}")

    public List<Message>
    getMessages(

            @PathVariable
            Long contractId
    ) {

        return messageService
                .getMessagesByContract(
                        contractId
                );
    }

    @GetMapping("/conversations")

    public List<ConversationDTO>
    getConversations() {

        String email =
                (String)
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

        return messageService
                .getConversations(
                        email
                );
    }

    @PutMapping("/read")

    public String markAsRead(

            @RequestParam
            Long senderId
    ) {

        String email =
                (String)
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();


        User currentUser =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        messageService.markMessagesAsRead(

                currentUser.getId(),

                senderId
        );

        return "Messages marked as read";
    }

    @PostMapping("/upload")

    public Message uploadFile(

            @RequestParam("file")
            MultipartFile file,

            @RequestParam
            Long contractId,

            @RequestParam
            Long receiverId
    ) throws Exception {

        String email =
                (String)
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

        // SAVE FILE
        String originalFileName =
                Path.of(file.getOriginalFilename())
                        .getFileName()
                        .toString();

        String fileName =
                System.currentTimeMillis()
                        + "_"
                        + originalFileName;

        Path uploadDirectory =
                Paths.get("uploads");

        Files.createDirectories(uploadDirectory);

        Path filePath =
                uploadDirectory.resolve(fileName);

        Files.copy(

                file.getInputStream(),

                filePath
        );

        // SAVE MESSAGE
        MessageRequestDTO dto =
                new MessageRequestDTO();

        dto.setContractId(contractId);

        dto.setReceiverId(receiverId);

        dto.setContent("File shared");

        Message message =
                messageService.sendMessage(
                        email,
                        dto
                );

        message.setFileUrl(fileName);

        return messageRepository.save(
                message
        );
    }
}
