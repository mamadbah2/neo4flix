package sn.dev.recommendation_service.web.controllers.implementation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sn.dev.recommendation_service.services.RecommendationService;
import sn.dev.recommendation_service.services.ShareService;
import sn.dev.recommendation_service.web.controllers.RecommendationController;
import sn.dev.recommendation_service.web.dto.requests.ShareRequest;
import sn.dev.recommendation_service.web.dto.responses.MovieResponse;

/**
 * Implémentation du contrôleur de recommandations.
 */
@RestController
@RequiredArgsConstructor
public class RecommendationControllerImpl implements RecommendationController {

    private final RecommendationService recommendationService;
    private final ShareService shareService;

    @Override
    public ResponseEntity<List<MovieResponse>> getMyRecs(Jwt jwt) {
        String userId = jwt.getClaimAsString("sub");
        List<MovieResponse> recommendations = recommendationService.getRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }

    @Override
    public ResponseEntity<List<MovieResponse>> getSharedRecs(Jwt jwt) {
        String userId = jwt.getClaimAsString("sub");
        List<MovieResponse> sharedRecs = recommendationService.getSharedRecommendations(userId);
        return ResponseEntity.ok(sharedRecs);
    }

    @Override
    public ResponseEntity<Void> shareMovie(Jwt jwt, ShareRequest request) {
        String userId = jwt.getClaimAsString("sub");
        shareService.shareMovie(userId, request.getTargetUserId(), request.getTmdbId());
        return ResponseEntity.ok().build();
    }
}
