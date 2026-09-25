package com.bookstore.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Response for the Buy Again endpoint.
 * Returns the updated cart plus any books skipped due to zero stock.
 */
@Data
@Builder
public class BuyAgainResponse {

    private CartResponse cart;
    private List<SkippedBook> skippedBooks;

    @Data
    @Builder
    public static class SkippedBook {
        private java.util.UUID bookId;
        private String title;
    }
}
