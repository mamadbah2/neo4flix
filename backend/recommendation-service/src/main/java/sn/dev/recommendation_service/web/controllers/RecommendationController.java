package sn.dev.recommendation_service.web.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.dev.recommendation_service.web.dto.responses.MovieResponse;

@RequestMapping("/api/recommendations")
public interface RecommendationController {
    @GetMapping("/")
    ResponseEntity<List<MovieResponse>> getMyRecs(@AuthenticationPrincipal Jwt jwt);
}
