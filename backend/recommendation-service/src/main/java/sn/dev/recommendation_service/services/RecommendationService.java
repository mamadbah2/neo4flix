package sn.dev.recommendation_service.services;

import java.util.List;

import sn.dev.recommendation_service.web.dto.responses.MovieResponse;

public interface RecommendationService {
    List<MovieResponse> getRecommendations(String userId);
}
