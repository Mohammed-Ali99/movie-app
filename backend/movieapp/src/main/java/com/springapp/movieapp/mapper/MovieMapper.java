package com.springapp.movieapp.mapper;

import com.springapp.movieapp.dto.MovieDto;
import com.springapp.movieapp.entity.Movie;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MovieMapper {

    MovieDto toDto(Movie entity);

    Movie toEntity(MovieDto dto);
}
