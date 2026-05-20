package com.freelance.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import com.freelance.demo.security.JwtFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(
            CorsConfigurationSource corsConfigurationSource
    ) {
        this.corsConfigurationSource
                = corsConfigurationSource;
    }

    @Bean
    public JwtFilter jwtFilter() {
        return new JwtFilter();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session
                        -> session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS
                )
                )
                .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        HttpMethod.OPTIONS,
                        "/**"
                ).permitAll()
                .requestMatchers(
                        "/api/auth/**"
                ).permitAll()
                .requestMatchers(
                        "/ws/**"
                ).permitAll()
                .requestMatchers(
                        "/uploads/**"
                ).permitAll()
                .requestMatchers(
                        "/api/payments/**"
                ).authenticated()
                .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtFilter(),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
