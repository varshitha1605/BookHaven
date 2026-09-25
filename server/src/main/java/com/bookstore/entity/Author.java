package com.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "authors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Author {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 500)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 200)
    private String genre;

    @Column(name = "famous_works", columnDefinition = "TEXT")
    private String famousWorks;

    @Column(name = "photo_url", length = 1000)
    private String photoUrl;

    @OneToMany(mappedBy = "authorEntity", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Book> books = new ArrayList<>();
}
