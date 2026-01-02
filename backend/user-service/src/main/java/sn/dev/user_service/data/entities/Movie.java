package sn.dev.user_service.data.entities;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Projection légère de l'entité Movie pour les relations du user-service.
 * Les films sont gérés par movie-service, mais on référence les nœuds existants.
 */
@Node("Movie")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
    @Id
    private String id;
    private String title;
    private String description;
    private int year;
}
