package sn.dev.recommendation_service.services;

import java.util.List;

import sn.dev.recommendation_service.data.entities.Movie;

public interface RecommendationService {
    List<Movie> getRecommendations(String userId);
}
