package sn.dev.user_service.web.controllers.implementation;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import sn.dev.user_service.services.UserService;
import sn.dev.user_service.web.controllers.UserController;
import sn.dev.user_service.web.dto.requests.UserCreateRequest;
import sn.dev.user_service.web.dto.responses.UserResponse;
import sn.dev.user_service.web.mappers.UserMapper;

@RestController
public class UserControllerImpl implements UserController {

    private final UserService userService;

    public UserControllerImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public ResponseEntity<UserResponse> getUserById(String id) {
        var user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(UserMapper.toResponse(user));
    }

    @Override
    public ResponseEntity<UserResponse> createUser(UserCreateRequest userRequest) {
        var user = UserMapper.fromCreateRequest(userRequest);
        var saved = userService.createUser(user);
        return ResponseEntity.ok(UserMapper.toResponse(saved));
    }

    @Override
    public ResponseEntity<UserResponse> getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.badRequest().build();
        }

        Jwt jwt;
        try {
            jwt = (Jwt) authentication.getPrincipal();
        } catch (ClassCastException e) {
            return ResponseEntity.badRequest().build();
        }
        
        var user = userService.syncUser(jwt);
        return ResponseEntity.ok(UserMapper.toResponse(user));
        
    }
}