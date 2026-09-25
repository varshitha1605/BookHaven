package com.bookstore.repository;

import com.bookstore.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AuthorRepository extends JpaRepository<Author, UUID> {

    Optional<Author> findByNameIgnoreCase(String name);

    @Query("SELECT a FROM Author a LEFT JOIN FETCH a.books WHERE a.id = :id")
    Optional<Author> findByIdWithBooks(@Param("id") UUID id);

    @Query("SELECT DISTINCT a FROM Author a LEFT JOIN FETCH a.books ORDER BY a.name")
    List<Author> findAllWithBooks();
}
