package sn.dev.recommendation_service.services.implementation;

import java.util.LinkedHashSet;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sn.dev.recommendation_service.clients.MovieClient;
import sn.dev.recommendation_service.services.RecommendationService;
import sn.dev.recommendation_service.web.dto.responses.MovieResponse;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final MovieClient movieClient;

    @Override
    public List<MovieResponse> getRecommendations(String userId) {
        List<MovieResponse> collaborative = movieClient.getCollaborativeRecs().getBody();
        List<MovieResponse> genreBased = movieClient.getGenreBasedRecs().getBody();

        // Utiliser un Set pour éviter les doublons
        LinkedHashSet<MovieResponse> combined = new LinkedHashSet<>();
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
