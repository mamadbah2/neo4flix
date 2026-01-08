package sn.dev.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuration de sécurité pour l'API Gateway.
 * Gère CORS et définit les endpoints publics vs protégés.
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                // Désactiver CSRF pour une API REST
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                
                // Configuration CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // Configuration des autorisations
                .authorizeExchange(exchanges -> exchanges
                        // Permettre les requêtes OPTIONS pour CORS preflight
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        
                        // Endpoints publics - Discovery et recherche de films
                        .pathMatchers(HttpMethod.GET, "/api/movies/discovery/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/movies/search").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/movies/genres").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/movies/{tmdbId}").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/movies/{tmdbId}/similar").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/movies/{tmdbId}/reviews").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/movies/batch").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/movies/{tmdbId}/sync").permitAll()
                        
                        // Endpoints internes
                        .pathMatchers("/internal/**").permitAll()
                        
                        // Actuator health check
                        .pathMatchers("/actuator/**").permitAll()
                        
                        // Tous les autres endpoints nécessitent une authentification
                        .anyExchange().authenticated()
                )
                
                // Configuration OAuth2 Resource Server avec JWT
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> {})
                )
                
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:4200",
                "http://127.0.0.1:4200"
        ));
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
