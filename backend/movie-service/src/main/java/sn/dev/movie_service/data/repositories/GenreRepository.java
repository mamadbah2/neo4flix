package sn.dev.movie_service.data.repositories;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import sn.dev.movie_service.data.entities.Genre;

/**
 * Repository Neo4j pour les genres.
 * Les genres utilisent l'ID TMDb comme identifiant.
 */
public interface GenreRepository extends Neo4jRepository<Genre, Integer> {
    
}
