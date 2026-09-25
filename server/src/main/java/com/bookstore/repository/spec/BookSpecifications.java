package com.bookstore.repository.spec;

import com.bookstore.entity.Book;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Reusable JPA Specifications for dynamic Book filtering.
 * All parameters are optional — null values are silently skipped.
 */
public final class BookSpecifications {

    private BookSpecifications() {}

    /**
     * Builds a composite Specification from optional filter parameters.
     *
     * @param query       full-text search on title, author, ISBN, description
     * @param categoryId  filter by category UUID
     * @param publisherId filter by publisher UUID
     * @param minPrice    inclusive lower price bound
     * @param maxPrice    inclusive upper price bound
     * @param minRating   inclusive minimum averageRating
     * @param inStockOnly when true, only include books with stockQuantity > 0
     */
    public static Specification<Book> build(
            String query,
            UUID categoryId,
            UUID publisherId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BigDecimal minRating,
            Boolean inStockOnly) {

        return (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Full-text: ILIKE on title, author, isbn, description
            if (query != null && !query.isBlank()) {
                String pattern = "%" + query.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")),       pattern),
                        cb.like(cb.lower(root.get("author")),      pattern),
                        cb.like(cb.lower(root.get("isbn")),        pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (publisherId != null) {
                predicates.add(cb.equal(root.get("publisher").get("id"), publisherId));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (minRating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("averageRating"), minRating));
            }

            if (Boolean.TRUE.equals(inStockOnly)) {
                predicates.add(cb.greaterThan(root.get("stockQuantity"), 0));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
