package sn.dev.recommendation_service.data.entities;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Projection légère de l'entité User pour le recommendation-service.
 * Les utilisateurs sont gérés par user-service.
 */
@Node("User")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String keycloakId;
    private String username;
    private String email;
}
