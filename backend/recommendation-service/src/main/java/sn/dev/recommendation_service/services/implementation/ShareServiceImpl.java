package sn.dev.recommendation_service.services.implementation;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sn.dev.recommendation_service.data.repositories.ShareRepository;
import sn.dev.recommendation_service.exceptions.ForbiddenException;
import sn.dev.recommendation_service.exceptions.NotFoundException;
import sn.dev.recommendation_service.services.ShareService;

/**
 * Implémentation du service de partage.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ShareServiceImpl implements ShareService {

    private final ShareRepository shareRepository;

    @Override
    public void shareMovie(String userId, String targetUserId, Long tmdbId) {
        // Vérifier que l'utilisateur ne partage pas avec lui-même
        if (userId.equals(targetUserId)) {
            throw new IllegalArgumentException("Vous ne pouvez pas partager un film avec vous-même");
        }

        // Vérifier que l'utilisateur suit bien la cible
        if (!shareRepository.isFollowing(userId, targetUserId)) {
            throw new ForbiddenException("Vous ne pouvez partager qu'avec des utilisateurs que vous suivez");
        }

        // Vérifier que le film existe dans Neo4j
        if (!shareRepository.movieExists(tmdbId)) {
            throw new NotFoundException("Le film avec TMDb ID " + tmdbId + " n'existe pas. Synchronisez-le d'abord.");
        }

        // Créer la relation de partage
        shareRepository.shareMovieWithFriend(userId, targetUserId, tmdbId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFollowing(String userId, String targetUserId) {
        return shareRepository.isFollowing(userId, targetUserId);
    }
}
