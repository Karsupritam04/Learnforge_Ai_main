package com.texttolearn.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security setup for the API.
 *
 * If AUTH0_ISSUER is not set (local/dev), every /api/** route is left open so you can build
 * and test the course-generation flow without wiring Auth0 first.
 *
 * Once AUTH0_ISSUER + AUTH0_AUDIENCE are set (see application.properties / Milestone 4),
 * write-style routes that persist content to a specific user (save-course, user-courses, etc.)
 * are protected behind a valid Bearer access token, while course/lesson reads stay public.
 */
@Configuration
public class SecurityConfig {

    @Value("${auth0.issuer:}")
    private String auth0Issuer;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);

        boolean auth0Configured = auth0Issuer != null && !auth0Issuer.isBlank();

        if (!auth0Configured) {
            // Dev mode: no Auth0 configured yet, open everything up
            http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }

        http.authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/health").permitAll()
                        .requestMatchers("GET", "/api/courses/**").permitAll()
                        .requestMatchers("POST", "/api/generate/**").permitAll()
                        .requestMatchers("/api/user/**", "/api/save-course/**").authenticated()
                        .anyRequest().permitAll())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}));

        return http.build();
    }
}
