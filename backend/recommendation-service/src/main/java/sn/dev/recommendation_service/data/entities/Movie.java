package sn.dev.recommendation_service.data.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
    private String id;
    private String title;
    private Integer year;
    private String description;
    // ...
}
