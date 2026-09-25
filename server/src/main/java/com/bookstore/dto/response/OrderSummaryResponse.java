package com.bookstore.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class OrderSummaryResponse {

    private UUID id;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal total;
    private int itemCount;
    private Instant placedAt;

    /**
     * Timestamp 48 hours after placedAt.
     * Null when the order is already CANCELLED or DELIVERED.
     */
    private Instant cancellableUntil;
}
