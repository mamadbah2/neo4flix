package sn.dev.user_service.services;

import sn.dev.user_service.data.entities.User;

public interface UserService {
    User getUserById(String id);
    User createUser(User user);
} 
