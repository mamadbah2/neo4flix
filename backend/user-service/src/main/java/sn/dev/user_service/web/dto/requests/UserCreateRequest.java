package sn.dev.user_service.web.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserCreateRequest {
    private String keycloakId;
    private String username;
    private String email;
    private String password;
}
