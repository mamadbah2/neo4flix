package sn.dev.rating_service.data.entities;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Movie {
    private String id;
    private String title;
    private int year;
    private String description;
    // ...
}
