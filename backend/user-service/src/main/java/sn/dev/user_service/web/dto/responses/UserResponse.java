package sn.dev.user_service.web.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id; // keycloak ID
    private String username;
    private String email;

}
