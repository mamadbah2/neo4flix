package sn.dev.movie_service.web.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO pour un membre du casting.
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CastMemberResponse {
    
    private Long id;
    private String name;
    private String character;
    private String profilePath;
    private Integer order;
}
