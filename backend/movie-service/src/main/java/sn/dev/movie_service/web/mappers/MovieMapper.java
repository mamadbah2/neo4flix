package sn.dev.movie_service.web.mappers;

import java.util.ArrayList;
import java.util.List;

import sn.dev.movie_service.data.entities.Genre;
import sn.dev.movie_service.data.entities.Movie;
import sn.dev.movie_service.web.dto.responses.MovieResponse;

/**
 * Mapper pour les films.
 * Note: La plupart des mappings sont maintenant dans MovieServiceImpl
 * car ils nécessitent les données TMDb.
 */
public class MovieMapper {

    private MovieMapper() {
        // Utility class
    }

    /**
     * Mappe une entité Movie Neo4j vers un MovieResponse minimal.
     * Utilisé pour les réponses qui ne nécessitent pas d'enrichissement TMDb.
     */
    public static MovieResponse toMinimalResponse(Movie movie) {
        if (movie == null) return null;
        
        List<String> genreNames = new ArrayList<>();
        if (movie.getGenres() != null) {
            genreNames = movie.getGenres().stream()
                    .map(Genre::getName)
                    .toList();
        }
        
        return MovieResponse.builder()
                .tmdbId(movie.getTmdbId())
                .title(movie.getTitle())
                .posterPath(movie.getPosterPath())
                .genres(genreNames)
                .syncedInNeo4j(true)
                .build();
    }
}
