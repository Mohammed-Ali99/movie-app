package com.springapp.movieapp.service.exception;

import com.springapp.movieapp.config.Constants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessException extends RuntimeException {

    private HttpStatus httpStatus;
    private String message;

    public static BusinessException buildNotFoundException(Class<?> entity , Long id) {
        return BusinessException
                .builder()
                .httpStatus(HttpStatus.NOT_FOUND)
                .message(Constants.NOT_FOUND)
                .build();
    }

    public static BusinessException buildNotFoundException(Class<?> entity , String id) {
        return BusinessException
                .builder()
                .httpStatus(HttpStatus.NOT_FOUND)
                .message(Constants.NOT_FOUND)
                .build();
    }

    public static BusinessException buildNotFoundException(String message) {
        return BusinessException
                .builder()
                .httpStatus(HttpStatus.NOT_FOUND)
                .message(message)
                .build();
    }

    public static BusinessException buildBadRequestException(String message) {

        return BusinessException
                .builder()
                .message(message)
                .httpStatus(HttpStatus.BAD_REQUEST)
                .build();
    }

    public static BusinessException buildUnauthorizedException(String message) {
        return BusinessException
                .builder()
                .message(message)
                .httpStatus(HttpStatus.UNAUTHORIZED)
                .build();
    }
}
