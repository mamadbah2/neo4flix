package sn.dev.user_service.web.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.dev.user_service.web.dto.requests.UserCreateRequest;
import sn.dev.user_service.web.dto.responses.UserResponse;

@RequestMapping("/api/users")
public interface UserController {
    @GetMapping("/{id}")
    ResponseEntity<UserResponse> getUserById(@PathVariable String id);

    @GetMapping("/me")
    ResponseEntity<UserResponse> getCurrentUser();

    @PostMapping("/")
    ResponseEntity<UserResponse> createUser(@RequestBody UserCreateRequest user);
}
