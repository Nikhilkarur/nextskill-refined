package com.nextskill.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Value("${security.cors.allowed-origins:http://localhost:5500,http://127.0.0.1:5500,http://localhost:5173,http://127.0.0.1:5173}")
    private String allowedOriginsCsv;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String[] origins = allowedOriginsCsv.split(",");
                registry.addMapping("/api/**")
                        // Use origin patterns to support wildcards for preview domains (e.g., *.netlify.app)
                        .allowedOriginPatterns(origins)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
