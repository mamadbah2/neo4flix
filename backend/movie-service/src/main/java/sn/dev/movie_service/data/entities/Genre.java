package sn.dev.movie_service.data.entities;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entité Genre stockée dans Neo4j.
 * L'ID correspond à l'ID TMDb du genre.
 */
@Node("Genre")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Genre {
    
    @Id
    private Integer tmdbId;
    
    private String name;
}
