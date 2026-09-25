package com.bookstore.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class OrderItemResponse {

    private UUID id;
    private BookSummaryResponse book;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
}
