package com.springapp.movieapp.service.impl;


import com.springapp.movieapp.entity.User;
import com.springapp.movieapp.repository.UserRepository;
import com.springapp.movieapp.service.UserService;
import com.springapp.movieapp.service.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> BusinessException.buildNotFoundException(User.class, username));
    }

}
