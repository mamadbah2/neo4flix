package sn.dev.user_service.services;

import org.springframework.security.oauth2.jwt.Jwt;

import sn.dev.user_service.data.entities.User;

public interface UserService {
    User getUserById(String id);
    User createUser(User user);
    User syncUser(Jwt jwt);
} 
