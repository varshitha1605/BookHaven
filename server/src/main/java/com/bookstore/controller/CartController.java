package com.bookstore.controller;

import com.bookstore.dto.request.CartItemRequest;
import com.bookstore.dto.request.UpdateCartItemRequest;
import com.bookstore.dto.response.CartResponse;
import com.bookstore.service.CartService;
import com.bookstore.service.UserResolverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart management")
@SecurityRequirement(name = "bearerAuth")
public class CartController {

    private final CartService cartService;
    private final UserResolverService userResolverService;

    @GetMapping
    @Operation(summary = "Get current user's cart")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cart contents"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<CartResponse> getCart(
            @AuthenticationPrincipal UserDetails principal) {
        UUID userId = userResolverService.resolveId(principal.getUsername());
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping
    @Operation(summary = "Add a book to the cart")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Updated cart"),
        @ApiResponse(responseCode = "400", description = "Insufficient stock or invalid quantity"),
        @ApiResponse(responseCode = "404", description = "Book not found")
    })
    public ResponseEntity<CartResponse> addToCart(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CartItemRequest request) {
        UUID userId = userResolverService.resolveId(principal.getUsername());
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update quantity of a cart item")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Updated cart"),
        @ApiResponse(responseCode = "400", description = "Insufficient stock"),
        @ApiResponse(responseCode = "404", description = "Cart item not found")
    })
    public ResponseEntity<CartResponse> updateItem(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable UUID itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        UUID userId = userResolverService.resolveId(principal.getUsername());
        return ResponseEntity.ok(cartService.updateItem(userId, itemId, request.getQuantity()));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove a specific item from the cart")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Updated cart"),
        @ApiResponse(responseCode = "404", description = "Cart item not found")
    })
    public ResponseEntity<CartResponse> removeItem(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable UUID itemId) {
        UUID userId = userResolverService.resolveId(principal.getUsername());
        return ResponseEntity.ok(cartService.removeItem(userId, itemId));
    }

    @DeleteMapping
    @Operation(summary = "Clear the entire cart")
    @ApiResponse(responseCode = "204", description = "Cart cleared")
    public ResponseEntity<Void> clearCart(
            @AuthenticationPrincipal UserDetails principal) {
        UUID userId = userResolverService.resolveId(principal.getUsername());
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
