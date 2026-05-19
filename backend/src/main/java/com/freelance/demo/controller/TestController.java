package com.freelance.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Freelance Marketplace Backend Running 🚀";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}