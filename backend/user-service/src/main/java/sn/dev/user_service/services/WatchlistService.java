package sn.dev.user_service.services;

import java.util.List;

import sn.dev.user_service.data.entities.Movie;

/**
 * Service pour la gestion des watchlists.
 * Utilise tmdbId comme identifiant de film.
 */
public interface WatchlistService {
    
    List<Movie> getWatchlist(String userId);
    
    /**
     * Ajoute un film à la watchlist.
     * Synchronise d'abord le film avec movie-service.
     */
    void addToWatchlist(String userId, Long tmdbId);
    
    void removeFromWatchlist(String userId, Long tmdbId);
    
    boolean isInWatchlist(String userId, Long tmdbId);
}
