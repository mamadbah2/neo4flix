package sn.dev.user_service.services.implementation;

import org.springframework.stereotype.Service;

import sn.dev.user_service.data.entities.User;
import sn.dev.user_service.data.repositories.UserRepository;
import sn.dev.user_service.services.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
}
