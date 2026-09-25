package com.bookstore.dto.request;

import jakarta.validation.Valid;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class MergeCartRequest {

    @Valid
    private List<CartItemRequest> items = new ArrayList<>();
}
