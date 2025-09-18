package com.springapp.movieapp.repository;

import com.springapp.movieapp.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    boolean existsByImdbId(String imdbId);

    void deleteByImdbId(String imdbId);

    @Query("select m from Movie m where upper(m.title) like upper(concat('%' , :searchKey , '%') ) ")
    List<Movie> findBySearchKey(@Param("searchKey") String searchKey);
}
