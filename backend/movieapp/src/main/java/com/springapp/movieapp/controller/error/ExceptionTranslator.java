package com.springapp.movieapp.controller.error;

import com.springapp.movieapp.controller.response.ApiResponse;
import com.springapp.movieapp.controller.response.ApiResponseUtil;
import com.springapp.movieapp.service.exception.BusinessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionTranslator {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse> handleBusinessException(BusinessException e) {
        ApiResponse body = ApiResponseUtil.buildError(e.getHttpStatus().toString(), e.getMessage());
        return ResponseEntity.status(e.getHttpStatus()).body(body);
    }
}
