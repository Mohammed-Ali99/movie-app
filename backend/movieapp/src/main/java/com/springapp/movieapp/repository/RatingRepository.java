package com.springapp.movieapp.repository;

import com.springapp.movieapp.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {
}
