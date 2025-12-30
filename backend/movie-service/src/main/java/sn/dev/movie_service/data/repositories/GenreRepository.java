package sn.dev.movie_service.data.repositories;
import org.springframework.data.neo4j.repository.Neo4jRepository;

import sn.dev.movie_service.data.entities.Genre;

public interface GenreRepository extends Neo4jRepository<Genre, String> {
    
}
