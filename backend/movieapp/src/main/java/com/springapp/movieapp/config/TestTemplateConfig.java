package com.springapp.movieapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class TestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        // Configure reasonable timeouts to avoid hanging calls in restricted/offline environments
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(2000); // 2 seconds
        factory.setReadTimeout(3000);    // 3 seconds
        return new RestTemplate(factory);
    }
}
