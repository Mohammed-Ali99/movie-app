package com.springapp.movieapp.service;


import com.springapp.movieapp.entity.User;

public interface UserService {

    User findByUsername(String username);
}
