package com.springapp.movieapp.service;

import com.springapp.movieapp.dto.OmdbMovieResponse;
import com.springapp.movieapp.dto.OmdbSearchResponse;

public interface OmdbService {

    OmdbMovieResponse getMovieByTitle(String title);

    OmdbSearchResponse searchMovies(String keyword, int page);
}
