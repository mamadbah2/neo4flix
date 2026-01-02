package sn.dev.recommendation_service.web.dto.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShareRequest {
    
    @NotBlank(message = "targetUserId est requis")
    private String targetUserId;
    
    @NotBlank(message = "movieId est requis")
    private String movieId;
}
