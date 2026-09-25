package com.bookstore.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PagedResponse<T> {

    private List<T> content;
    private PageMetadata pagination;

    @Data
    @Builder
    public static class PageMetadata {
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
    }
}
