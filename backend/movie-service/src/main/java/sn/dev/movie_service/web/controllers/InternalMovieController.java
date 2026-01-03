package sn.dev.movie_service.web.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.dev.movie_service.web.dto.responses.SyncResponse;

/**
 * Contrôleur interne pour les appels inter-services.
 * Utilisé par user-service et rating-service pour synchroniser les films.
 */
@RequestMapping("/internal/movies")
public interface InternalMovieController {

    /**
     * Synchronise un film dans Neo4j.
     * Appelé par les autres services avant de créer des relations (WATCHLIST, RATED).
     * 
     * @param tmdbId l'ID TMDb du film
     * @return les informations de synchronisation
     */
    @PostMapping("/{tmdbId}/sync")
    ResponseEntity<SyncResponse> syncMovie(@PathVariable Long tmdbId);
}
