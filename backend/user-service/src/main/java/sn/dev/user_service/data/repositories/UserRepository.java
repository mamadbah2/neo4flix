package sn.dev.user_service.data.repositories;

import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import sn.dev.user_service.data.entities.User;

public interface UserRepository extends Neo4jRepository<User, String> {
    Optional<User> findByKeycloakId(String keycloakId);
}
