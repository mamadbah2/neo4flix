package sn.dev.movie_service.services;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Mapping statique des IDs de genres TMDb vers leurs noms.
 * Source : https://developer.themoviedb.org/reference/genre-movie-list
 */
public final class TmdbGenreMapping {

    private static final Map<Integer, String> GENRE_MAP;

    static {
        Map<Integer, String> map = new HashMap<>();
        map.put(28, "Action");
        map.put(12, "Aventure");
        map.put(16, "Animation");
        map.put(35, "Comédie");
        map.put(80, "Crime");
        map.put(99, "Documentaire");
        map.put(18, "Drame");
        map.put(10751, "Familial");
        map.put(14, "Fantastique");
        map.put(36, "Histoire");
        map.put(27, "Horreur");
        map.put(10402, "Musique");
        map.put(9648, "Mystère");
        map.put(10749, "Romance");
        map.put(878, "Science-Fiction");
        map.put(10770, "Téléfilm");
        map.put(53, "Thriller");
        map.put(10752, "Guerre");
        map.put(37, "Western");
        GENRE_MAP = Collections.unmodifiableMap(map);
    }

    private TmdbGenreMapping() {
        // Utility class
    }

    /**
     * Retourne le nom du genre pour un ID TMDb donné.
     *
     * @param genreId l'ID du genre TMDb
     * @return le nom du genre ou "Unknown" si non trouvé
     */
    public static String getGenreName(Integer genreId) {
        return GENRE_MAP.getOrDefault(genreId, "Unknown");
    }

    /**
     * Retourne la map complète des genres.
     */
    public static Map<Integer, String> getAllGenres() {
        return GENRE_MAP;
    }
}
