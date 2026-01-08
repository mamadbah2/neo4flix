package sn.dev.rating_service.web.dto.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO pour la réponse paginée des ratings d'un film.
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieRatingsPageResponse {
    private Long tmdbId;
    private int page;
    private int totalPages;
    private int totalResults;
    private Double averageScore;
    private List<MovieRatingResponse> ratings;
}
