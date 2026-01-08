package sn.dev.movie_service.data.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import sn.dev.movie_service.data.entities.Movie;

/**
 * Repository Neo4j pour les films.
 * Utilise des requêtes Cypher optimisées pour éviter le chargement massif d'objets.
 */
public interface MovieRepository extends Neo4jRepository<Movie, Long> {

    /**
     * Trouve un film par son TMDb ID avec ses genres.
     */
    @Query("MATCH (m:Movie {tmdbId: $tmdbId}) " +
           "OPTIONAL MATCH (m)-[:IN_GENRE]->(g:Genre) " +
           "RETURN m, collect(g) as genres")
    Optional<Movie> findByTmdbIdWithGenres(@Param("tmdbId") Long tmdbId);

    /**
     * Vérifie si un film existe dans Neo4j.
     */
    @Query("MATCH (m:Movie {tmdbId: $tmdbId}) RETURN COUNT(m) > 0")
    boolean existsByTmdbId(@Param("tmdbId") Long tmdbId);

    /**
     * MERGE un film dans Neo4j (crée ou met à jour).
     * Requête atomique pour la synchronisation lazy.
     */
    @Query("MERGE (m:Movie {tmdbId: $tmdbId}) " +
           "ON CREATE SET m.title = $title, m.posterPath = $posterPath " +
           "ON MATCH SET m.title = $title, m.posterPath = $posterPath " +
           "RETURN m")
    Movie mergeMovie(
        @Param("tmdbId") Long tmdbId,
        @Param("title") String title,
        @Param("posterPath") String posterPath
    );

    /**
     * MERGE un genre et crée la relation IN_GENRE avec le film.
     */
    @Query("MATCH (m:Movie {tmdbId: $tmdbId}) " +
           "MERGE (g:Genre {tmdbId: $genreId}) " +
           "ON CREATE SET g.name = $genreName " +
           "MERGE (m)-[:IN_GENRE]->(g)")
    void mergeGenreRelation(
        @Param("tmdbId") Long tmdbId,
        @Param("genreId") Integer genreId,
        @Param("genreName") String genreName
    );

    /**
     * Récupère les noms des genres d'un film.
     */
    @Query("MATCH (m:Movie {tmdbId: $tmdbId})-[:IN_GENRE]->(g:Genre) " +
           "RETURN g.name")
    List<String> findGenreNamesByTmdbId(@Param("tmdbId") Long tmdbId);

    // ================== RECOMMANDATIONS ==================

    /**
     * Recommandations collaboratives : films aimés par des utilisateurs similaires.
     */
    @Query("MATCH (u:User {keycloakId: $userId})-[r1:RATED]->(m1:Movie)<-[r2:RATED]-(other:User)-[r3:RATED]->(rec:Movie) " +
           "WHERE r1.score >= 3 AND r2.score >= 3 AND r3.score >= 4 " +
           "AND NOT (u)-[:RATED]->(rec) " +
           "RETURN DISTINCT rec.tmdbId as tmdbId LIMIT 10")
    List<Long> getCollaborativeRecsTmdbIds(@Param("userId") String userId);

    /**
     * Recommandations basées sur les genres préférés.
     */
    @Query("MATCH (u:User {keycloakId: $userId})-[r:RATED]->(m:Movie)-[:IN_GENRE]->(g:Genre) " +
           "WHERE r.score >= 4 " +
           "WITH u, g, count(*) as frequency " +
           "ORDER BY frequency DESC LIMIT 2 " +
           "MATCH (rec:Movie)-[:IN_GENRE]->(g) " +
           "WHERE NOT (u)-[:RATED]->(rec) " +
           "RETURN DISTINCT rec.tmdbId as tmdbId LIMIT 10")
    List<Long> getGenreBasedRecsTmdbIds(@Param("userId") String userId);

    // ================== LOCAL RATINGS ==================

    /**
     * Récupère la note moyenne locale d'un film.
     */
    @Query("MATCH (:User)-[r:RATED]->(m:Movie {tmdbId: $tmdbId}) " +
           "RETURN avg(r.score)")
    Double getAverageRating(@Param("tmdbId") Long tmdbId);

    /**
     * Récupère le nombre de notes locales d'un film.
     */
    @Query("MATCH (:User)-[r:RATED]->(m:Movie {tmdbId: $tmdbId}) " +
           "RETURN count(r)")
    Integer getRatingCount(@Param("tmdbId") Long tmdbId);

    /**
     * Récupère les avis locaux d'un film avec pagination.
     */
    @Query("MATCH (u:User)-[r:RATED]->(m:Movie {tmdbId: $tmdbId}) " +
           "WHERE r.comment IS NOT NULL AND r.comment <> '' " +
           "RETURN u.keycloakId as userId, u.username as username, r.score as score, r.comment as comment, r.createdAt as createdAt " +
           "ORDER BY r.createdAt DESC " +
           "SKIP $skip LIMIT $limit")
    List<sn.dev.movie_service.data.projections.LocalReviewProjection> getLocalReviews(
            @Param("tmdbId") Long tmdbId,
            @Param("skip") int skip,
            @Param("limit") int limit
    );

    /**
     * Compte le nombre d'avis locaux (avec commentaire) d'un film.
     */
    @Query("MATCH (u:User)-[r:RATED]->(m:Movie {tmdbId: $tmdbId}) " +
           "WHERE r.comment IS NOT NULL AND r.comment <> '' " +
           "RETURN count(r)")
    Integer countLocalReviews(@Param("tmdbId") Long tmdbId);
}
