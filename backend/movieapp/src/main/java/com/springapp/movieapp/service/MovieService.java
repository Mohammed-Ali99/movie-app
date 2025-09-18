package com.springapp.movieapp.service;

import com.springapp.movieapp.dto.MovieDto;

import java.util.List;

public interface MovieService {

    List<MovieDto> findAll(String searchKey);

    MovieDto findById(Long id);

    MovieDto addMovie(MovieDto dto);

    void removeMovie(String imdbId);

    boolean existsById(Long id);
}
