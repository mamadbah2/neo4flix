package sn.dev.movie_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

import feign.RequestInterceptor;

/**
 * Configuration Feign pour l'API TMDb.
 * Ajoute automatiquement le token Bearer à chaque requête.
 */
public class TmdbFeignConfig {

    @Value("${tmdb.api.access-token}")
    private String accessToken;

    @Bean
    public RequestInterceptor tmdbRequestInterceptor() {
        return template -> {
            template.header("Authorization", "Bearer " + accessToken);
            template.header("Accept", "application/json");
        };
    }
}
