package sn.dev.recommendation_service.services.implementation;

import java.util.LinkedHashSet;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sn.dev.recommendation_service.data.entities.Movie;
import sn.dev.recommendation_service.data.repositories.RecommendationRepository;
import sn.dev.recommendation_service.services.RecommendationService;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final RecommendationRepository recommendationRepository;

    @Override
    public List<Movie> getRecommendations(String userId) {
        List<Movie> collaborative = recommendationRepository.getCollaborativeRecs(userId);
        List<Movie> genreBased = recommendationRepository.getGenreBasedRecs(userId);

        // Utiliser un Set pour éviter les doublons
        LinkedHashSet<Movie> combined = new LinkedHashSet<>();
        // Mélanger les deux listes en alternant les éléments
        int maxSize = Math.max(collaborative.size(), genreBased.size());
        for (int i = 0; i < maxSize; i++) {
            if (i < collaborative.size()) {
                combined.add(collaborative.get(i));
            }
            if (i < genreBased.size()) {
                combined.add(genreBased.get(i));
            }
        }
        // Retourner la liste finale (max 10 éléments)
        return combined.stream().limit(10).toList();
    }

}
