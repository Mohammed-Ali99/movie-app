package com.springapp.movieapp.controller;

import com.springapp.movieapp.controller.response.ApiResponse;
import com.springapp.movieapp.controller.response.ApiResponseUtil;
import com.springapp.movieapp.dto.MovieDto;
import com.springapp.movieapp.dto.OmdbMovieResponse;
import com.springapp.movieapp.dto.OmdbSearchResponse;
import com.springapp.movieapp.service.MovieService;
import com.springapp.movieapp.service.OmdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/movies")
public class MovieController {

    private final MovieService  movieService;
    private final OmdbService omdbService;


    @PostMapping
    public ApiResponse addMovie(@RequestBody MovieDto dto) {
        MovieDto movieDto = movieService.addMovie(dto);
        return ApiResponseUtil.buildCreatedSuccessfully(movieDto);
    }

    @DeleteMapping("/{imdbId}")
    public ApiResponse removeMovie(@PathVariable String imdbId) {
        movieService.removeMovie(imdbId);
        return ApiResponseUtil.buildDeletedSuccessfully();
    }

    @GetMapping("/{title}")
    public ApiResponse getMovie(@PathVariable String title) {
        OmdbMovieResponse movieByTitle = omdbService.getMovieByTitle(title);
        return ApiResponseUtil.buildGet(movieByTitle);
    }

    @GetMapping("/search")
    public ApiResponse searchMovies(@RequestParam String keyword,
                                           @RequestParam(defaultValue = "1") int page) {
        OmdbSearchResponse omdbSearchResponse = omdbService.searchMovies(keyword, page);
        return ApiResponseUtil.buildGet(omdbSearchResponse);
    }
}
