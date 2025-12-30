package sn.dev.movie_service.web.dto.requests;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sn.dev.movie_service.data.entities.Genre;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class MovieCreateRequest {
    private String title;
    private String description;
    private int releaseYear;
    private List<Genre> genres;
}
