package sn.dev.user_service.data.entities;

import org.springframework.data.neo4j.core.schema.Node;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Node("User")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String keycloakId;
    private String username;
    private String email;
    
}
