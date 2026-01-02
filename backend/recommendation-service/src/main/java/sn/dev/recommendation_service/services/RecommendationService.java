package sn.dev.recommendation_service.services;

import java.util.List;

import sn.dev.recommendation_service.web.dto.responses.MovieResponse;

public interface RecommendationService {
    
    /**
     * Récupère les recommandations pour un utilisateur.
     * Les films partagés par des amis sont boostés en priorité.
     */
    List<MovieResponse> getRecommendations(String userId);
    
    /**
     * Récupère uniquement les films partagés par les amis.
     */
    List<MovieResponse> getSharedRecommendations(String userId);
}
