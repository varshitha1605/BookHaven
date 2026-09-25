package com.bookstore.repository;

import com.bookstore.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BookRepository extends JpaRepository<Book, UUID>, JpaSpecificationExecutor<Book> {

    Page<Book> findByCategorySlug(String slug, Pageable pageable);

    Page<Book> findByPublisherId(UUID publisherId, Pageable pageable);

    /**
     * Related books: same category first, then same author.
     * Excludes the current book. The caller passes Pageable.ofSize(6) to cap results.
     * Note: LIMIT is not valid JPQL; Pageable.setMaxResults is the portable approach.
     */
    @Query("""
            SELECT b FROM Book b
            WHERE b.id <> :bookId
              AND (b.category.id = :categoryId OR b.author = :author)
            ORDER BY
              CASE WHEN b.category.id = :categoryId THEN 0 ELSE 1 END,
              b.averageRating DESC
            """)
    List<Book> findRelatedBooks(
            @Param("bookId") UUID bookId,
            @Param("categoryId") UUID categoryId,
            @Param("author") String author,
            Pageable pageable);
}
