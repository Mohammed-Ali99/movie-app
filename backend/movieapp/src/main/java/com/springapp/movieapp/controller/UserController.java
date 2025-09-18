package com.springapp.movieapp.controller;

import com.springapp.movieapp.controller.response.ApiResponse;
import com.springapp.movieapp.controller.response.ApiResponseUtil;
import com.springapp.movieapp.dto.MovieDto;
import com.springapp.movieapp.service.MovieService;
import com.springapp.movieapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/movies")
@RequiredArgsConstructor
public class UserController {

    private final MovieService movieService;

    @GetMapping
    public ApiResponse findAllMovies(@RequestParam(required = false) String searchKey) {
        List<MovieDto> all = movieService.findAll(searchKey);
        return ApiResponseUtil.buildGet(all);
    }

    @GetMapping("/{id}")
    public ApiResponse findById(@PathVariable Long id) {
        MovieDto dto = movieService.findById(id);
        return ApiResponseUtil.buildGet(dto);
    }

}
