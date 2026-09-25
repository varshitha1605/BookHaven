package com.bookstore.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class CartResponse {

    private UUID id;
    private List<CartItemResponse> items;
    private int itemCount;
    private BigDecimal subtotal;
}
