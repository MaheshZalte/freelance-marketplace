package com.freelance.demo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class LoginResponseDTO {

    private Long id;

    private String token;

    private String email;

    private String role;

    private String name;
}
