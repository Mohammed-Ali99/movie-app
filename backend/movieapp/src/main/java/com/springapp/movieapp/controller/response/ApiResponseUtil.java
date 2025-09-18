package com.springapp.movieapp.controller.response;

import com.springapp.movieapp.config.Constants;
import lombok.experimental.UtilityClass;


@UtilityClass
public class ApiResponseUtil {
    private ApiResponse buildSuccess(Object object, String code, String message) {
        return ApiResponse.builder()
                .data(object)
                .code(code)
                .message(message)
                .build();
    }

    public ApiResponse buildError(String code, String message) {
        return ApiResponse.builder()
                .data(null)
                .code(code)
                .message(message)
                .build();
    }

    public ApiResponse buildCreatedSuccessfully(Object object) {
        return buildSuccess(object, Constants.CREATE_SUCCESS_CODE, Constants.CREATED_SUCCESSFULLY);
    }


    public static ApiResponse buildDeletedSuccessfully() {
        return buildSuccess(null, Constants.CREATE_SUCCESS_CODE, Constants.DELETED_SUCCESSFULLY);
    }

    public ApiResponse buildGet(Object object) {
        return buildSuccess(object, Constants.SUCCESS_CODE, Constants.REQUEST_COMPLETED_SUCCESSFULLY);
    }

    public ApiResponse buildLoginSuccess(Object object) {
        return buildSuccess(object, Constants.SUCCESS_CODE, Constants.REQUEST_COMPLETED_SUCCESSFULLY);
    }
}
