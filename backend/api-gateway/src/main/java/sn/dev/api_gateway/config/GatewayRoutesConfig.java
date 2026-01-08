package sn.dev.api_gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration des routes du Gateway.
 * Définit les routes vers les différents microservices.
 */
@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Route vers user-service
                .route("user-service", r -> r
                        .path("/api/users/**")
                        .uri("http://user-service:8081"))
                
                // Route vers movie-service
                .route("movie-service", r -> r
                        .path("/api/movies/**")
                        .uri("http://movie-service:8082"))
                
                // Route vers recommendation-service
                .route("recommendation-service", r -> r
                        .path("/api/recommendations/**")
                        .uri("http://recommendation-service:8083"))
                
                // Route vers rating-service
                .route("rating-service", r -> r
                        .path("/api/rates/**")
                        .uri("http://rating-service:8084"))
                
                // Route interne pour movie-service
                .route("internal-movies", r -> r
                        .path("/internal/movies/**")
                        .uri("http://movie-service:8082"))
                
                .build();
    }
}
