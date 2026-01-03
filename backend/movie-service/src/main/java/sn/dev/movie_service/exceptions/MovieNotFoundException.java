package sn.dev.movie_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception levée lorsqu'un film n'est pas trouvé.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class MovieNotFoundException extends RuntimeException {
    
    public MovieNotFoundException(Long tmdbId) {
        super("Film avec TMDb ID " + tmdbId + " non trouvé");
    }
    
    public MovieNotFoundException(String message) {
        super(message);
    }
}
