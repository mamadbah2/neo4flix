package sn.dev.recommendation_service.data.entities;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Projection légère de l'entité Movie pour le recommendation-service.
 * Les films sont gérés par movie-service.
 * Utilise tmdbId comme identifiant unique.
 */
@Node("Movie")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {
    
    @Id
    private Long tmdbId;
    
    private String title;
    
    private String posterPath;
}
