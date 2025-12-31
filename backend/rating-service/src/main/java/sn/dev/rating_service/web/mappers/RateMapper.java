package sn.dev.rating_service.web.mappers;

import org.springframework.stereotype.Component;
import sn.dev.rating_service.web.dto.requests.RateRequest;
import sn.dev.rating_service.web.dto.responses.RateResponse;
import sn.dev.rating_service.data.entities.Rate;

@Component
public class RateMapper {

    // Convertir RateRequest (DTO) vers Rate (entité)
    public static Rate toEntity(RateRequest dto) {
        Rate rate = new Rate();
        rate.setScore(dto.getScore());
    
        // Si Rate a un champ movieId ou autre, l'ajouter ici
        return rate;
    }

    // Convertir Rate (entité) vers RateResponse (DTO)
    public static RateResponse toDto(Rate entity) {
        RateResponse dto = new RateResponse();
        // Ajouter les setters selon les champs de RateResponse et Rate
        dto.setScore(entity.getScore());
        return dto;
    }
}