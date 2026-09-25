package com.bookstore.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class BookDetailResponse {

    private UUID id;
    private String title;
    private String author;
    private String isbn;
    private String coverImageUrl;
    private BigDecimal price;
    private Integer stockQuantity;
    private String description;
    private Integer pageCount;
    private String language;
    private LocalDate publishedDate;
    private BigDecimal averageRating;
    private Integer reviewCount;
    private CategoryResponse category;
    private PublisherResponse publisher;
    private AuthorResponse authorDetail;
    private List<BookSummaryResponse> relatedBooks;
}
