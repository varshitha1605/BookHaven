package com.bookstore.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class BookSummaryResponse {

    private UUID id;
    private String title;
    private String author;
    private String coverImageUrl;
    private BigDecimal price;
    private BigDecimal averageRating;
    private Integer reviewCount;
    private Integer stockQuantity;
    private CategoryResponse category;
    private PublisherResponse publisher;
}
