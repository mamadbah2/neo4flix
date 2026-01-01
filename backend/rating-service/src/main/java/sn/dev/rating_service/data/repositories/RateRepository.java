package sn.dev.rating_service.data.repositories;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import sn.dev.rating_service.data.entities.Rate;

public interface RateRepository extends Neo4jRepository<Rate, String> {
    @Query("MATCH (u:User {keycloakId: $userId}) MATCH (m:Movie {id: $movieId}) " +
        "MERGE (u)-[r:RATED]->(m) " +
        "SET r.score = $score " +
        "RETURN r, m")
    Rate createRate(String userId, String movieId, int score); 
}
