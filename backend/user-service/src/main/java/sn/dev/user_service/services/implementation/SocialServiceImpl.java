package sn.dev.user_service.services.implementation;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sn.dev.user_service.data.entities.User;
import sn.dev.user_service.data.repositories.SocialRepository;
import sn.dev.user_service.services.SocialService;

@Service
@Transactional
public class SocialServiceImpl implements SocialService {

    private final SocialRepository socialRepository;

    public SocialServiceImpl(SocialRepository socialRepository) {
        this.socialRepository = socialRepository;
    }

    @Override
    public void followUser(String userId, String targetUserId) {
        if (userId.equals(targetUserId)) {
            throw new IllegalArgumentException("Un utilisateur ne peut pas se suivre lui-même");
        }
        socialRepository.followUser(userId, targetUserId);
    }

    @Override
    public void unfollowUser(String userId, String targetUserId) {
        socialRepository.unfollowUser(userId, targetUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getFollowing(String userId) {
        return socialRepository.findFollowing(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getFollowers(String userId) {
        return socialRepository.findFollowers(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFollowing(String userId, String targetUserId) {
        return socialRepository.isFollowing(userId, targetUserId);
    }
}
