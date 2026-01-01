package sn.dev.rating_service.clients;

// ...existing code..

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import sn.dev.rating_service.config.FeignConfig;
import sn.dev.rating_service.web.dto.responses.MovieResponse;

@FeignClient(
    name = "movie-service", 
    url = "${movie.service.url}",
    configuration = FeignConfig.class
)
public interface MovieClient {
    @GetMapping("/api/movies/{id}")
    MovieResponse getMovieById(@PathVariable("id") String id);
}