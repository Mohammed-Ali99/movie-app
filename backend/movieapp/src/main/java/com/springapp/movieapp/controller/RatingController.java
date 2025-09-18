package com.springapp.movieapp.controller;

import com.springapp.movieapp.controller.response.ApiResponse;
import com.springapp.movieapp.controller.response.ApiResponseUtil;
import com.springapp.movieapp.dto.RatingDto;
import com.springapp.movieapp.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rating")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ApiResponse rateMovie(@RequestBody RatingDto dto) {
        RatingDto ratingDto = ratingService.rateMovie(dto);
        return ApiResponseUtil.buildGet(ratingDto);
    }
}
