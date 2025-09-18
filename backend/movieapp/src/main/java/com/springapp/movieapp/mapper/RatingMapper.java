package com.springapp.movieapp.mapper;

import com.springapp.movieapp.dto.RatingDto;
import com.springapp.movieapp.entity.Rating;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RatingMapper {

    @Mapping(source = "movie.id", target = "movieId")
    RatingDto toDto(Rating entity);

    @Mapping(source = "movieId", target = "movie.id")
    Rating toEntity(RatingDto dto);
}
