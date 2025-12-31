package sn.dev.rating_service.web.controllers.implementation;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sn.dev.rating_service.services.RateService;
import sn.dev.rating_service.web.controllers.RateController;
import sn.dev.rating_service.web.dto.requests.RateRequest;
import sn.dev.rating_service.web.dto.responses.RateResponse;
import sn.dev.rating_service.web.mappers.RateMapper;

@RestController
@RequiredArgsConstructor
public class RateControllerImpl implements RateController {
    private final RateService rateService;

    @Override
    public ResponseEntity<RateResponse> createRate(RateRequest rateRequest) {
        // Récupérer le userId depuis le token (SecurityContext)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.badRequest().build();
        }

        Jwt jwt = (Jwt) authentication.getPrincipal();
        if (jwt == null) {
            return ResponseEntity.badRequest().build();
        }
        String userId = jwt.getClaimAsString("sub"); // "sub" est l'ID de l'utilisateur dans le token JWT de Keycloak

        // Appeler le service pour créer la note
        var rate = rateService.createRate(userId, rateRequest.getMovieId(), rateRequest.getScore());

        // Mapper l'entité vers le DTO de réponse
        RateResponse response = RateMapper.toDto(rate);

        return ResponseEntity.ok(response);
    }
}