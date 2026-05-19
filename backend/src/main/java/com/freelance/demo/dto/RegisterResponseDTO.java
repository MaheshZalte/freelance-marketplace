package com.freelance.demo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class RegisterResponseDTO {

    private String name;

    private String email;

    private String role;
}