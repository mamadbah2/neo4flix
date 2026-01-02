package sn.dev.recommendation_service.clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import sn.dev.recommendation_service.config.FeignConfig;
import sn.dev.recommendation_service.web.dto.responses.MovieResponse;

@FeignClient(
    name = "movie-service", 
    url = "${movie.service.url}",
    configuration = FeignConfig.class
)
public interface MovieClient {
    @GetMapping("/recommendations/collaborative")
    ResponseEntity<List<MovieResponse>> getCollaborativeRecs();

    @GetMapping("/recommendations/genre-based")
    ResponseEntity<List<MovieResponse>> getGenreBasedRecs();
}