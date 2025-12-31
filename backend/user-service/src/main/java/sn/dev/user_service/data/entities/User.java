package sn.dev.user_service.data.entities;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Node("User")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String keycloakId;
    private String username;
    private String email;
    
    @Relationship(type="RATED", direction = Relationship.Direction.OUTGOING)
    private List<Rate> rates = new ArrayList<>();
}
