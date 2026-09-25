package com.bookstore.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class OrderDetailResponse {

    // ── Inherited from summary ─────────────────────────────────────────────
    private UUID id;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal total;
    private int itemCount;
    private Instant placedAt;
    private Instant cancellableUntil;

    // ── Detail-only fields ─────────────────────────────────────────────────
    private List<OrderItemResponse> items;
    private AddressResponse shippingAddress;
    private Instant cancelledAt;
    private String cancelReason;
}
