package sn.dev.rating_service.web.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.dev.rating_service.web.dto.requests.RateRequest;
import sn.dev.rating_service.web.dto.responses.RateResponse;

@RequestMapping("/api/rates")
public interface RateController {
    /**
     * Créer ou mettre à jour une note pour un film.
     * Accepte POST sur /api/rates et /api/rates/
     */
    @PostMapping({"", "/"})
    ResponseEntity<RateResponse> createRate(@RequestBody RateRequest rateRequest);
}
