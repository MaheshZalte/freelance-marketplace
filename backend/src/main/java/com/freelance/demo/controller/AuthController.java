package com.freelance.demo.controller;

import com.freelance.demo.dto.ApiResponse;
import com.freelance.demo.dto.LoginRequest;
import com.freelance.demo.dto.LoginResponseDTO;
import com.freelance.demo.dto.RegisterResponseDTO;
import com.freelance.demo.entity.User;
import com.freelance.demo.service.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired
    private UserService userService;

    // REGISTER
    @PostMapping("/register")

    public ApiResponse<RegisterResponseDTO>
    register(
            @Valid @RequestBody User user
    ) {

        RegisterResponseDTO response =
                userService.register(user);

        return new ApiResponse<>(

                true,

                "User registered successfully",

                response
        );
    }

    // LOGIN
    @PostMapping("/login")

    public ApiResponse<LoginResponseDTO> login(
            @RequestBody LoginRequest request
    ) {

        LoginResponseDTO response =
                userService.login(
                        request.getEmail(),
                        request.getPassword()
                );

        return new ApiResponse<>(
                true,
                "Login successful",
                response
        );
    }

    // TEST API
    @GetMapping("/test")

    public String test() {

        return "Protected API working";
    }
}