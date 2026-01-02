package sn.dev.movie_service.data.repositories;
import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import sn.dev.movie_service.data.entities.Movie;

public interface MovieRepository extends Neo4jRepository<Movie, String> {
     // 1. Les gens qui ont aimé les mêmes films que toi (Collaborative)
    @Query("MATCH (u:User {keycloakId: $userId})-[r1:RATED]->(m1:Movie)<-[r2:RATED]-(other:User)-[r3:RATED]->(rec:Movie) " +
           "WHERE r1.score >= 3 AND r2.score >= 3 AND r3.score >= 4 " +
           "AND NOT (u)-[:RATED]->(rec) " +
           "RETURN rec LIMIT 10")
    List<Movie> getCollaborativeRecs(String userId);

    // 2. Selon tes genres préférés (Content-based)
    @Query("MATCH (u:User {keycloakId: $userId})-[r:RATED]->(m:Movie)-[:BELONGS_TO]->(g:Genre) " +
           "WHERE r.score >= 4 " +
           "WITH u, g, count(*) as frequency " +
           "ORDER BY frequency DESC LIMIT 2 " +
           "MATCH (rec:Movie)-[:BELONGS_TO]->(g) " +
           "WHERE NOT (u)-[:RATED]->(rec) " +
           "RETURN rec LIMIT 10")
    List<Movie> getGenreBasedRecs(String userId);
}
