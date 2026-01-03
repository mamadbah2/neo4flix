package sn.dev.movie_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuration de sécurité pour le movie-service.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Endpoints de discovery publics (TMDb direct)
                .requestMatchers("/api/movies/discovery/**").permitAll()
                .requestMatchers("/api/movies/search").permitAll()
                // Endpoint de détails public
                .requestMatchers("/api/movies/{tmdbId}").permitAll()
                // Endpoint de sync interne (accessible sans auth pour les services internes)
                .requestMatchers("/api/movies/*/sync").permitAll()
                // Endpoint internal pour les autres services
                .requestMatchers("/internal/**").permitAll()
                // Recommendations nécessitent une authentification
                .requestMatchers("/api/movies/recommendations/**").authenticated()
                .anyRequest().permitAll()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(Customizer.withDefaults())
            )
            .build();
    }
}
