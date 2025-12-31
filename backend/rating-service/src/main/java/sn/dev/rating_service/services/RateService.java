package sn.dev.rating_service.services;

import sn.dev.rating_service.data.entities.Rate;

public interface RateService {
    Rate createRate(String userId, String movieId, int score);
}
