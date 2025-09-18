package com.springapp.movieapp.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MovieDto {

    private Long id;
    private String title;
    private String year;
    private String imdbId;
    private String type;
    private String poster;
}
