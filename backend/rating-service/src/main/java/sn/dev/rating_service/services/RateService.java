package sn.dev.rating_service.services;

import sn.dev.rating_service.data.entities.Rate;

/**
 * Service pour la gestion des notations de films.
 * Utilise tmdbId comme identifiant de film.
 */
public interface RateService {
    
    /**
     * Crée ou met à jour une notation pour un film.
     * Synchronise d'abord le film avec movie-service.
     * 
     * @param userId l'ID Keycloak de l'utilisateur
     * @param tmdbId l'ID TMDb du film
     * @param score la note (1-5)
     * @param comment commentaire optionnel
     */
    Rate createRate(String userId, Long tmdbId, int score, String comment);
    
    /**
     * Récupère la notation d'un utilisateur pour un film.
     */
    Integer getRating(String userId, Long tmdbId);
    
    /**
     * Supprime la notation d'un utilisateur pour un film.
     */
    void deleteRate(String userId, Long tmdbId);
}
