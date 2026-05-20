package com.freelance.demo.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if (request.getServletPath().startsWith("/api/auth/")
                || request.getMethod().equals("OPTIONS")
                || request.getServletPath().startsWith("/ws/")) {

            filterChain.doFilter(request, response);
            return;
        }

        String authHeader
                = request.getHeader("Authorization");

        if (authHeader != null
                && authHeader.startsWith("Bearer ")) {

            String token
                    = authHeader.substring(7);

            try {

                String email
                        = jwtUtil.extractEmail(token);

                String role
                        = jwtUtil.extractRole(token);

                UsernamePasswordAuthenticationToken authentication
                        = new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.singletonList(
                                        new SimpleGrantedAuthority(role)
                                )
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

            } catch (Exception e) {

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
