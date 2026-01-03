package sn.dev.user_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

/**
 * Client Feign interne pour synchroniser les films avant de créer des relations.
 * Appelle le movie-service pour s'assurer que le film existe dans Neo4j.
 */
@FeignClient(
    name = "movie-service-internal",
    url = "${movie.service.url}"
)
public interface InternalMovieClient {

    /**
     * Synchronise un film dans Neo4j avant de créer une relation WATCHLIST.
     * 
     * @param tmdbId l'ID TMDb du film
     * @return réponse de synchronisation
     */
    @PostMapping("/internal/movies/{tmdbId}/sync")
    SyncResponse syncMovie(@PathVariable("tmdbId") Long tmdbId);
}
