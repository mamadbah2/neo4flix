package sn.dev.user_service.services.implementation;

import org.springframework.security.oauth2.jwt.Jwt;
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
        return userRepository.findByKeycloakId(id).orElse(null);
    }

    @Override 
    // Deprecated: use syncUser instead
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User syncUser(Jwt jwt) {
        String keycloakId = jwt.getClaimAsString("sub");
        
        return userRepository.findById(keycloakId)
            .orElseGet(() -> {
                // Si l'utilisateur n'existe pas dans Neo4j, on le crée
                User newUser = new User();
                newUser.setKeycloakId(keycloakId);
                newUser.setUsername(jwt.getClaimAsString("username"));
                newUser.setEmail(jwt.getClaimAsString("email"));
                return userRepository.save(newUser);
            });
    }
    
}
