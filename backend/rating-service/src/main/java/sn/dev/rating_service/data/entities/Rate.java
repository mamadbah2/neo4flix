package sn.dev.rating_service.data.entities;

import org.springframework.data.neo4j.core.schema.RelationshipId;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@RelationshipProperties
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Rate {
    @RelationshipId
    private String id;
    private int score;
    
    /**
     * Commentaire optionnel sur le film.
     */
    private String comment;
    
    /**
     * Date de création de l'avis.
     */
    private String createdAt;
    
    @TargetNode
    private Movie movie;
}
