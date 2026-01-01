package sn.dev.rating_service.services.implementation;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sn.dev.rating_service.clients.MovieClient;
import sn.dev.rating_service.data.entities.Rate;
import sn.dev.rating_service.data.repositories.RateRepository;
import sn.dev.rating_service.exceptions.NotFoundException;
import sn.dev.rating_service.services.RateService;

@Service
@RequiredArgsConstructor
public class RateServiceImpl implements RateService  {

    private final RateRepository rateRepository;
    private final MovieClient movieClient;

    @Override
    public Rate createRate(String userId, String movieId, int score) {
        if (!checkMovieExists(movieId)) {
            throw new NotFoundException("Movie with ID " + movieId + " not found.");
        }
        System.out.println("++++++++++++++++++++++++++++++++++++++++++");
        System.out.println("Creating rate for userId: " + userId + ", movieId: " + movieId + ", score: " + score);

        return rateRepository.createRate(userId, movieId, score);
    }

    private boolean checkMovieExists(String movieId) {
        return movieClient.getMovieById(movieId) != null;
    }
    
}
