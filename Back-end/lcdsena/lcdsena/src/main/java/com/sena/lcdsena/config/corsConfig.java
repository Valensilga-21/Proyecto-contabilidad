package com.sena.lcdsena.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class corsConfig {
    @Bean
		public CorsFilter corsFilter() {
			UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
			CorsConfiguration config = new CorsConfiguration();
			
			//direcciones locales
			config.addAllowedOrigin("*");
			
			config.addAllowedMethod("GET");
			config.addAllowedMethod("POST");
			config.addAllowedMethod("PUT");
			config.addAllowedMethod("DELETE");
			
			config.addAllowedHeader("Authorization");
			config.addAllowedHeader("Content-Type");
			
			source.registerCorsConfiguration("/**", config);
			return new CorsFilter(source);
		}
}
