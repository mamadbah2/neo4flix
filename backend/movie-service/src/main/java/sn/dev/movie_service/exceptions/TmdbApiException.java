package sn.dev.movie_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception levée lors d'erreurs de communication avec TMDb.
 */
@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class TmdbApiException extends RuntimeException {
    
    public TmdbApiException(String message) {
        super("Erreur TMDb API : " + message);
    }
    
    public TmdbApiException(String message, Throwable cause) {
        super("Erreur TMDb API : " + message, cause);
    }
}
