package sn.dev.user_service.web.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.dev.user_service.web.dto.requests.UserCreateRequest;
import sn.dev.user_service.web.dto.responses.UserProfileResponse;
import sn.dev.user_service.web.dto.responses.UserResponse;

@RequestMapping("/api/users")
public interface UserController {
    @GetMapping("/{id}")
    ResponseEntity<UserResponse> getUserById(@PathVariable String id);

    @GetMapping("/me")
    ResponseEntity<UserResponse> getCurrentUser();

    @PostMapping("/")
    ResponseEntity<UserResponse> createUser(@RequestBody UserCreateRequest user);

    /**
     * Récupère le profil complet de l'utilisateur authentifié avec ses statistiques.
     */
    @GetMapping("/profile")
    ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal Jwt jwt);

    /**
     * Récupère le profil public d'un utilisateur avec ses statistiques.
     */
    @GetMapping("/profile/{userId}")
    ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable String userId);
}
