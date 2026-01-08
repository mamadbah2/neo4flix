package sn.dev.recommendation_service.web.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.validation.Valid;
import sn.dev.recommendation_service.web.dto.requests.ShareRequest;
import sn.dev.recommendation_service.web.dto.responses.MovieResponse;

@RequestMapping("/api/recommendations")
public interface RecommendationController {
    
    @GetMapping({"", "/"})
    ResponseEntity<List<MovieResponse>> getMyRecs(@AuthenticationPrincipal Jwt jwt);
    
    @GetMapping("/shared")
    ResponseEntity<List<MovieResponse>> getSharedRecs(@AuthenticationPrincipal Jwt jwt);
    
    @PostMapping("/share")
    ResponseEntity<Void> shareMovie(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ShareRequest request);
}
