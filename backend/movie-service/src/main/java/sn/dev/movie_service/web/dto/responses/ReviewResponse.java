package sn.dev.movie_service.web.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO pour un avis sur un film.
 * Combine les avis TMDb et les avis locaux Neo4j.
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    
    private String id;
    private String author;
    private String authorUsername;
    private String avatarPath;
    private String content;
    private Double rating;
    private String createdAt;
    
    /**
     * Indique si c'est un avis local (Neo4j) ou externe (TMDb).
     */
    private boolean isLocal;
}
