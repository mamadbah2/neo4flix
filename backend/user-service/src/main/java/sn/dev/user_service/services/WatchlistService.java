package sn.dev.user_service.services;

import java.util.List;

import sn.dev.user_service.data.entities.Movie;

public interface WatchlistService {
    
    List<Movie> getWatchlist(String userId);
    
    void addToWatchlist(String userId, String movieId);
    
    void removeFromWatchlist(String userId, String movieId);
    
    boolean isInWatchlist(String userId, String movieId);
}
