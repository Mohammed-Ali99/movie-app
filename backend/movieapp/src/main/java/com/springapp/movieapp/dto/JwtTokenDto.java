package com.springapp.movieapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class JwtTokenDto {
    @JsonProperty("id_token")
    private String idToken;

    public JwtTokenDto(String idToken) {
        this.idToken = idToken;
    }
}
