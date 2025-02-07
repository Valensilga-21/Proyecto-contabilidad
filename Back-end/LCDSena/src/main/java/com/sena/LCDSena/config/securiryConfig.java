package com.sena.LCDSena.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class securiryConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
        .csrf(csrf->csrf.disable())
        .authorizeHttpRequests(
            autRequest->
            autRequest
            .requestMatchers("/apli/v1/LCDSena/publico/**").permitAll()
            .anyRequest().authenticated()
        )

        .formLogin(withDefaults())
        .build();
    }
}
