package sn.dev.user_service.services.implementation;

import java.util.Map;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import sn.dev.user_service.data.entities.User;
import sn.dev.user_service.data.repositories.UserRepository;
import sn.dev.user_service.services.UserService;
import sn.dev.user_service.web.dto.responses.UserProfileResponse;

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
        // jwt est une instance de org.springframework.security.oauth2.jwt.Jwt
        Map<String, Object> claims = jwt.getClaims();
        claims.forEach((key, value) -> {
            System.out.println(key + ": " + value);
        });
        String keycloakId = jwt.getClaimAsString("sub");

        return userRepository.findById(keycloakId)
                .orElseGet(() -> {
                    // Si l'utilisateur n'existe pas dans Neo4j, on le crée
                    User newUser = new User();
                    newUser.setKeycloakId(keycloakId);
                    newUser.setUsername(jwt.getClaimAsString("preferred_username"));
                    newUser.setEmail(jwt.getClaimAsString("email"));
                    return userRepository.save(newUser);
                });
    }

    @Override
    public UserProfileResponse getUserProfile(String userId) {
        User user = userRepository.findByKeycloakId(userId).orElse(null);
        if (user == null) {
            return null;
        }
        
        Integer followersCount = userRepository.countFollowers(userId);
        Integer followingCount = userRepository.countFollowing(userId);
        Integer watchlistCount = userRepository.countWatchlist(userId);
        Integer ratingsCount = userRepository.countRatings(userId);
        
        return UserProfileResponse.builder()
                .id(user.getKeycloakId())
                .username(user.getUsername())
                .email(user.getEmail())
                .followersCount(followersCount != null ? followersCount : 0)
                .followingCount(followingCount != null ? followingCount : 0)
                .watchlistCount(watchlistCount != null ? watchlistCount : 0)
                .ratingsCount(ratingsCount != null ? ratingsCount : 0)
                .build();
    }
}
