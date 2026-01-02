package sn.dev.user_service.services;

import java.util.List;

import sn.dev.user_service.data.entities.User;

public interface SocialService {
    
    void followUser(String userId, String targetUserId);
    
    void unfollowUser(String userId, String targetUserId);
    
    List<User> getFollowing(String userId);
    
    List<User> getFollowers(String userId);
    
    boolean isFollowing(String userId, String targetUserId);
}
