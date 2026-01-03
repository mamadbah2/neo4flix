package sn.dev.movie_service.data.entities;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entité Movie minimaliste stockée dans Neo4j.
 * TMDb est la source de vérité - Neo4j ne stocke que les relations.
 */
@Node("Movie")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {
    
    @Id
    private Long tmdbId;
    
    private String title;
    
    private String posterPath;

    @Relationship(type = "IN_GENRE", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private Set<Genre> genres = new HashSet<>();
}
