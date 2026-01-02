package sn.dev.user_service.web.controllers.implementation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import sn.dev.user_service.services.SocialService;
import sn.dev.user_service.web.controllers.SocialController;
import sn.dev.user_service.web.dto.responses.UserResponse;
import sn.dev.user_service.web.mappers.UserMapper;

@RestController
public class SocialControllerImpl implements SocialController {

    private final SocialService socialService;

    public SocialControllerImpl(SocialService socialService) {
        this.socialService = socialService;
    }

    @Override
    public ResponseEntity<Void> followUser(@AuthenticationPrincipal Jwt jwt, String targetUserId) {
        String userId = jwt.getClaimAsString("sub");
        socialService.followUser(userId, targetUserId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> unfollowUser(@AuthenticationPrincipal Jwt jwt, String targetUserId) {
        String userId = jwt.getClaimAsString("sub");
        socialService.unfollowUser(userId, targetUserId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<UserResponse>> getFollowing(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("sub");
        var users = socialService.getFollowing(userId);
        var response = users.stream()
                .map(UserMapper::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<List<UserResponse>> getFollowers(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("sub");
        var users = socialService.getFollowers(userId);
        var response = users.stream()
                .map(UserMapper::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Boolean> isFollowing(@AuthenticationPrincipal Jwt jwt, String targetUserId) {
        String userId = jwt.getClaimAsString("sub");
        boolean following = socialService.isFollowing(userId, targetUserId);
        return ResponseEntity.ok(following);
    }
}
