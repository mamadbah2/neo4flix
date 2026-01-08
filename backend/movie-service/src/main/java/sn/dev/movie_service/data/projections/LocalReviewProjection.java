package sn.dev.movie_service.data.projections;

/**
 * Projection pour les avis locaux (Neo4j).
 */
public interface LocalReviewProjection {
    String getUserId();
    String getUsername();
    Integer getScore();
    String getComment();
    String getCreatedAt();
}
