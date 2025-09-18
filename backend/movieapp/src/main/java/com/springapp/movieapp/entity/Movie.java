package com.springapp.movieapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "movies")
@Getter
@Setter
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "MOVIE_SEQ")
    @SequenceGenerator(name = "MOVIE_SEQ", initialValue = 1, allocationSize = 1)
    private Long id;

    @Column(name = "imdb_id")
    private String imdbId;

    @Column(name = "title")
    private String title;

    @Column(name = "year")
    private String year;

    @Column(name = "type")
    private String type;

    @Column(name = "poster")
    private String poster;

}
