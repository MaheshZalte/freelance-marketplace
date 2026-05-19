package com.freelance.demo.controller;

import com.freelance.demo.entity.User;
import com.freelance.demo.repository.UserRepository;
import com.freelance.demo.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.freelance.demo.dto.ProfileResponseDTO;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // GET LOGGED-IN USER PROFILE
    @GetMapping("/me")

    public ProfileResponseDTO getProfile() {

        String email = (String)
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        return userService.getProfile(email);
    }

    // UPDATE PROFILE
    @PutMapping("/me")
    public User updateProfile(
            @RequestBody User updatedUser
    ) {

        String email = (String)
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        return userService.updateProfile(
                email,
                updatedUser
        );
    }

    @PutMapping("/online")

    public String updateOnlineStatus(

            @RequestParam
            boolean online
    ) {

        String email =
                (String)
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

        userService.updateOnlineStatus(
                email,
                online
        );

        return "Status updated";
    }

    @PutMapping("/status")

    public User updateStatus(

            @RequestParam
            boolean online
    ) {

        String email =

                (String)

                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

        User user =

                userRepository
                        .findByEmail(email)
                        .orElseThrow(

                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        user.setOnline(
                online
        );

        return userRepository
                .save(user);
    }
}