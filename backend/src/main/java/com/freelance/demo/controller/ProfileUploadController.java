package com.freelance.demo.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.freelance.demo.entity.User;
import com.freelance.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/profile")
public class ProfileUploadController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public User uploadProfileImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is required");
        }

        String originalFileName = file.getOriginalFilename();
        String safeOriginal = originalFileName == null ? "profile" : originalFileName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String fileName = System.currentTimeMillis() + "_" + safeOriginal;

        Path uploadDirectory = Path.of("uploads");
        Files.createDirectories(uploadDirectory);

        Path filePath = uploadDirectory.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        user.setProfileImage(fileName);
        return userRepository.save(user);
    }
}

