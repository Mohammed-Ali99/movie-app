package com.springapp.movieapp.service.impl;

import com.springapp.movieapp.dto.RatingDto;
import com.springapp.movieapp.entity.Movie;
import com.springapp.movieapp.entity.Rating;
import com.springapp.movieapp.entity.User;
import com.springapp.movieapp.mapper.RatingMapper;
import com.springapp.movieapp.repository.RatingRepository;
import com.springapp.movieapp.repository.UserRepository;
import com.springapp.movieapp.service.MovieService;
import com.springapp.movieapp.service.RatingService;
import com.springapp.movieapp.service.UserService;
import com.springapp.movieapp.service.exception.BusinessException;
import com.springapp.movieapp.service.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final RatingMapper ratingMapper;
    private final UserService userService;
    private final MovieService movieService;

    public RatingDto rateMovie(RatingDto dto) {
        boolean exists = movieService.existsById(dto.getMovieId());
        if (!exists) {
            throw BusinessException.buildNotFoundException(Movie.class, dto.getMovieId());
        }

        if (dto.getStars() < 1 || dto.getStars() > 5) {
            throw BusinessException.buildBadRequestException("rate should be between 1 and 5");
        }

        Optional<String> optionalUsername = SecurityUtils.getCurrentUserLogin();
        if (optionalUsername.isEmpty()) {
            throw BusinessException.buildUnauthorizedException("unauthorized user");
        }

        String username = optionalUsername.get();
        User currentUser = userService.findByUsername(username);

        Rating entity = ratingMapper.toEntity(dto);
        entity.setUser(currentUser);

        entity = ratingRepository.save(entity);
        return ratingMapper.toDto(entity);
    }
}
