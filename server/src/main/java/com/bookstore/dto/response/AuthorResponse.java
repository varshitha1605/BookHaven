package com.bookstore.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AuthorResponse {
    private UUID id;
    private String name;
    private String bio;
    private String genre;
    private String famousWorks;
    private String photoUrl;
    private int bookCount;
}
