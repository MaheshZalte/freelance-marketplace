package com.freelance.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freelance.demo.dto.PublicProfileResponseDTO;
import com.freelance.demo.service.PublicProfileService;

@RestController
@RequestMapping("/api/users")
public class PublicProfileController {

    @Autowired
    private PublicProfileService publicProfileService;

    @GetMapping("/{userId}/profile")
    public PublicProfileResponseDTO getPublicProfileById(
            @PathVariable Long userId
    ) {
        return publicProfileService.getPublicProfileById(userId);
    }
}

