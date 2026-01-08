package sn.dev.recommendation_service.web.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Requête pour partager un film avec un ami.
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShareRequest {
    
    @NotBlank(message = "targetUserId est requis")
    private String targetUserId;
    
    @NotNull(message = "tmdbId est requis")
    private Long tmdbId;
    
    /**
     * Message personnalisé optionnel pour accompagner le partage.
     */
    @Size(max = 500, message = "Le message ne peut pas dépasser 500 caractères")
    private String message;
}
