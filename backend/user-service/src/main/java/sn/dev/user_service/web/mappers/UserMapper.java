package sn.dev.user_service.web.mappers;

import sn.dev.user_service.data.entities.User;
import sn.dev.user_service.web.dto.requests.UserCreateRequest;
import sn.dev.user_service.web.dto.responses.UserResponse;

public class UserMapper {

    // Transforme une entité User en UserResponse
    public static UserResponse toResponse(User user) {
        if (user == null) return null;
        return new UserResponse(
            user.getKeycloakId(),
            user.getUsername(),
            user.getEmail()
        );
    }

    // Transforme une UserCreateRequest en entité User
    public static User fromCreateRequest(UserCreateRequest request) {
        if (request == null) return null;
        User user = new User();
        user.setKeycloakId(request.getKeycloakId());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        return user;
    }
}