package com.springapp.movieapp.service.impl;

import com.springapp.movieapp.dto.MovieDto;
import com.springapp.movieapp.entity.Movie;
import com.springapp.movieapp.mapper.MovieMapper;
import com.springapp.movieapp.repository.MovieRepository;
import com.springapp.movieapp.service.MovieService;
import com.springapp.movieapp.service.OmdbService;
import com.springapp.movieapp.service.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final MovieMapper  movieMapper;

    @Override
    public List<MovieDto> findAll(String searchKey) {
        if (Objects.nonNull(searchKey)) {
            return movieRepository.findBySearchKey(searchKey)
                    .stream()
                    .map(movieMapper::toDto)
                    .toList();
        }
        return movieRepository
                .findAll()
                .stream()
                .map(movieMapper::toDto)
                .toList();
    }

    @Override
    public MovieDto findById(Long id) {
        return movieRepository.findById(id)
                .map(movieMapper::toDto)
                .orElseThrow(() -> BusinessException.buildNotFoundException(Movie.class, id));
    }

    public MovieDto addMovie(MovieDto dto) {
        boolean exists = movieRepository.existsByImdbId(dto.getImdbId());
        if (exists) {
            throw BusinessException.buildBadRequestException("Movie already exists");
        }

        Movie entity = movieMapper.toEntity(dto);
        entity = movieRepository.save(entity);
        return movieMapper.toDto(entity);
    }

    @Transactional
    public void removeMovie(String imdbId) {
        boolean exists = movieRepository.existsByImdbId(imdbId);
        if (!exists) {
            throw BusinessException.buildBadRequestException("Movie does not exists");
        }

        movieRepository.deleteByImdbId(imdbId);
    }

    @Override
    public boolean existsById(Long id) {
        return movieRepository.existsById(id);
    }
}
