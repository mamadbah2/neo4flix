package sn.dev.movie_service.data.repositories;
import org.springframework.data.neo4j.repository.Neo4jRepository;

import sn.dev.movie_service.data.entities.Movie;

public interface MovieRepository extends Neo4jRepository<Movie, String> {
    
}
