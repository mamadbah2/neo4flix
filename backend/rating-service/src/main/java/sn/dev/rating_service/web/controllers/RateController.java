package sn.dev.rating_service.web.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import sn.dev.rating_service.web.dto.requests.RateRequest;
import sn.dev.rating_service.web.dto.responses.MovieRatingsPageResponse;
import sn.dev.rating_service.web.dto.responses.RateResponse;

@RequestMapping("/api/rates")
public interface RateController {
    /**
     * Créer ou mettre à jour une note pour un film.
     * Accepte POST sur /api/rates et /api/rates/
     */
    @PostMapping({"", "/"})
    ResponseEntity<RateResponse> createRate(@RequestBody RateRequest rateRequest);

    /**
     * Récupérer les ratings d'un film avec pagination.
     */
    @GetMapping("/movie/{tmdbId}")
    ResponseEntity<MovieRatingsPageResponse> getMovieRatings(
            @PathVariable Long tmdbId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    );
}
