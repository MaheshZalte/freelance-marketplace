package com.freelance.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.freelance.demo.dto.PublicProfileResponseDTO;
import com.freelance.demo.entity.Review;
import com.freelance.demo.entity.User;
import com.freelance.demo.repository.ReviewRepository;
import com.freelance.demo.repository.UserRepository;

@Service
public class PublicProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public PublicProfileResponseDTO getPublicProfileById(Long userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Review> reviews = reviewRepository.findByReviewedUser_Email(user.getEmail());

        long reviewCount = reviews == null ? 0 : reviews.size();
        double avgReviewRating = 0.0;

        if (reviewCount > 0) {
            avgReviewRating = reviews
                    .stream()
                    .filter(r -> r.getRating() != null)
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
        }

        return new PublicProfileResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getTitle(),
                user.getSkills(),
                user.getBio(),
                user.getExperience(),
                user.getPortfolioLink(),
                user.getHourlyRate(),
                user.getRating(),
                user.getProfileImage(),
                reviewCount,
                avgReviewRating
        );
    }
}

