package sn.dev.user_service.web.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.dev.user_service.web.dto.responses.UserResponse;

@RequestMapping("/api/users")
public interface SocialController {

    @PostMapping("/follow/{targetUserId}")
    ResponseEntity<Void> followUser(@AuthenticationPrincipal Jwt jwt, @PathVariable String targetUserId);

    @DeleteMapping("/follow/{targetUserId}")
    ResponseEntity<Void> unfollowUser(@AuthenticationPrincipal Jwt jwt, @PathVariable String targetUserId);

    @GetMapping("/following")
    ResponseEntity<List<UserResponse>> getFollowing(@AuthenticationPrincipal Jwt jwt);

    @GetMapping("/followers")
    ResponseEntity<List<UserResponse>> getFollowers(@AuthenticationPrincipal Jwt jwt);

    @GetMapping("/following/{targetUserId}")
    ResponseEntity<Boolean> isFollowing(@AuthenticationPrincipal Jwt jwt, @PathVariable String targetUserId);
}
