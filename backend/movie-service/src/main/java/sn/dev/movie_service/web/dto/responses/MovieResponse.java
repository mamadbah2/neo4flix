package sn.dev.movie_service.web.dto.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sn.dev.movie_service.data.entities.Genre;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {
    private String id;
    private String title;
    private String description;
    private int releaseYear;
    private List<Genre> genres;
}
