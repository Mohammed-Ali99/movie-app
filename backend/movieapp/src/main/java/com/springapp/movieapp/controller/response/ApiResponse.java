package com.springapp.movieapp.controller.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;

@Builder
public class ApiResponse {

    public Object data ;

    public String code ;

    public String message ;

    @JsonIgnore
    public String messageHeader;
}
