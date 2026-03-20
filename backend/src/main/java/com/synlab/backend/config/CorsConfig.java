package com.synlab.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private static final String FRONTEND_ORIGIN = "http://localhost:3000";
    private static final String API_PATH_PATTERN = "/api/**";

    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {
        corsRegistry.addMapping(API_PATH_PATTERN)
                .allowedOrigins(FRONTEND_ORIGIN)
                .allowedMethods("GET");
    }
}
