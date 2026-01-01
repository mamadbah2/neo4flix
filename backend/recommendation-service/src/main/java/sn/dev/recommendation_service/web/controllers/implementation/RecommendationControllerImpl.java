package sn.dev.recommendation_service.web.controllers.implementation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sn.dev.recommendation_service.data.entities.Movie;
import sn.dev.recommendation_service.services.RecommendationService;
import sn.dev.recommendation_service.web.controllers.RecommendationController;

@RestController
@RequiredArgsConstructor
public class RecommendationControllerImpl implements RecommendationController {

    private final RecommendationService recommendationService;

    @Override
    public ResponseEntity<List<Movie>> getMyRecs(Jwt jwt) {
        // Récupérer l'id utilisateur depuis le token JWT (KeycloakId)
        String userId = jwt.getClaimAsString("sub");
        List<Movie> recommendations = recommendationService.getRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }
    
}
