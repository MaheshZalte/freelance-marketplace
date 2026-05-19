package com.freelance.demo.service;

import com.freelance.demo.dto.RegisterResponseDTO;
import com.freelance.demo.security.JwtUtil;
import com.freelance.demo.dto.LoginResponseDTO;
import com.freelance.demo.entity.User;
import com.freelance.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.freelance.demo.dto.ProfileResponseDTO;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public RegisterResponseDTO register(
            User user
    ) {
        user.setPassword(

                passwordEncoder.encode(
                        user.getPassword()

                )
        );

        // DEFAULT VALUES
        user.setRating(0.0);

        user.setOnline(false);

        User savedUser =
                userRepository.save(user);

        return new RegisterResponseDTO(

                savedUser.getName(),

                savedUser.getEmail(),

                savedUser.getRole()
        );
    }

    public LoginResponseDTO login(
            String email,
            String password
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        ));

        // CHECK PASSWORD
        if (!passwordEncoder.matches(
                password,
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        // GENERATE JWT
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        // RETURN DTO
        return new LoginResponseDTO(

                user.getId(),

                token,

                user.getEmail(),

                user.getRole(),

                user.getName()
        );
    }

    public ProfileResponseDTO getProfile(
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        return new ProfileResponseDTO(
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getSkills(),
                user.getBio(),
                user.getExperience(),
                user.getPortfolioLink(),
                user.getHourlyRate() != null ? String.valueOf(user.getHourlyRate()) : null,
                user.getProfileImage()
        );
    }

    public User updateProfile(
            String email,
            User updatedUser
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        user.setName(updatedUser.getName());

        user.setSkills(updatedUser.getSkills());

        return userRepository.save(user);
    }

    public void updateOnlineStatus(

            String email,

            boolean online
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        user.setOnline(online);

        if (!online) {

            user.setLastSeen(
                    LocalDateTime.now()
            );
        }

        userRepository.save(user);

        Object payload =
                Map.of(
                        "userId",
                        user.getId(),
                        "online",
                        user.getOnline()
                );

        messagingTemplate.convertAndSend(
                "/topic/users/status",
                payload
        );
    }
}
