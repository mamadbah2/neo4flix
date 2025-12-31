package sn.dev.movie_service.web.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.dev.movie_service.web.dto.requests.MovieCreateRequest;
import sn.dev.movie_service.web.dto.responses.MovieResponse;

@RequestMapping("/api/movies")
public interface MovieController {
    @GetMapping("/")
    ResponseEntity<List<MovieResponse>> getAllMovies();

    @GetMapping("/{id}")
    ResponseEntity<MovieResponse> getMovieById(@PathVariable String id);

    @PostMapping("/")
    ResponseEntity<MovieResponse> createMovie(@RequestBody MovieCreateRequest movie);
}
