package sn.dev.movie_service.web.dto.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO pour une page de reviews (pagination).
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewPageResponse {
    
    private Integer page;
    private Integer totalPages;
    private Integer totalResults;
    private List<ReviewResponse> reviews;
    
    /**
     * Note moyenne locale (des utilisateurs Neo4j).
     */
    private Double localAverageRating;
    
    /**
     * Nombre total de notes locales.
     */
    private Integer localRatingCount;
}
