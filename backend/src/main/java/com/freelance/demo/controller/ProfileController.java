package com.freelance.demo.controller;

import com.freelance.demo.entity.User;

import com.freelance.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")

public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    // GET PROFILE
    @GetMapping

    public User getProfile() {

        String email =

                (String)

                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getPrincipal();

        return userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );
    }

    // UPDATE PROFILE
    @PutMapping

    public User updateProfile(

            @RequestBody
            User updatedUser
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

        user.setName(
                updatedUser.getName()
        );

        user.setBio(
                updatedUser.getBio()
        );

        user.setSkills(
                updatedUser.getSkills()
        );

        user.setExperience(
                updatedUser.getExperience()
        );

        user.setPortfolioLink(
                updatedUser.getPortfolioLink()
        );

        user.setHourlyRate(
                updatedUser.getHourlyRate()
        );

        user.setProfileImage(
                updatedUser.getProfileImage()
        );

        return userRepository
                .save(user);
    }
}