package com.bookstore.controller;

import com.bookstore.dto.request.CancelOrderRequest;
import com.bookstore.dto.request.CheckoutRequest;
import com.bookstore.dto.response.BuyAgainResponse;
import com.bookstore.dto.response.OrderDetailResponse;
import com.bookstore.dto.response.OrderSummaryResponse;
import com.bookstore.dto.response.PagedResponse;
import com.bookstore.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order placement, history, detail, cancellation, and Buy Again")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "Get paginated order history for the current user")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Paged order history"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<PagedResponse<OrderSummaryResponse>> listOrders(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100),
                Sort.by(Sort.Direction.DESC, "placedAt"));
        return ResponseEntity.ok(orderService.listOrders(principal.getUsername(), pageable));
    }

    @PostMapping
    @Operation(
        summary = "Place an order (checkout)",
        description = "Validates cart, reserves stock, processes payment, creates the order, and clears the cart.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Order placed successfully"),
        @ApiResponse(responseCode = "400", description = "Empty cart, insufficient stock, or invalid address"),
        @ApiResponse(responseCode = "402", description = "Payment failed"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<OrderDetailResponse> placeOrder(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(orderService.placeOrder(principal.getUsername(), request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full order details")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Order detail"),
        @ApiResponse(responseCode = "404", description = "Order not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<OrderDetailResponse> getOrder(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getOrder(principal.getUsername(), id));
    }

    @PostMapping("/{id}/cancel")
    @Operation(
        summary = "Cancel an order",
        description = "Cancels the order if status is PENDING or CONFIRMED and within 48 hours of placement. "
                    + "Restores stock and issues a refund if payment was captured.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Order cancelled"),
        @ApiResponse(responseCode = "400", description = "Order cannot be cancelled"),
        @ApiResponse(responseCode = "404", description = "Order not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<OrderDetailResponse> cancelOrder(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable UUID id,
            @Valid @RequestBody CancelOrderRequest request) {
        return ResponseEntity.ok(orderService.cancelOrder(principal.getUsername(), id, request));
    }

    @PostMapping("/{id}/buy-again")
    @Operation(
        summary = "Re-add all items from a past order to the cart",
        description = "Adds order items back to the cart. Quantities are summed with existing cart items. "
                    + "Out-of-stock items are skipped and returned in skippedBooks.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cart updated, with list of any skipped books"),
        @ApiResponse(responseCode = "404", description = "Order not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<BuyAgainResponse> buyAgain(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable UUID id) {
        return ResponseEntity.ok(orderService.buyAgain(principal.getUsername(), id));
    }
}
