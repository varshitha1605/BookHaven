package com.bookstore.controller;

import com.bookstore.dto.request.LoginRequest;
import com.bookstore.dto.request.MergeCartRequest;
import com.bookstore.dto.request.RefreshTokenRequest;
import com.bookstore.dto.request.RegisterRequest;
import com.bookstore.dto.response.AuthResponse;
import com.bookstore.dto.response.CartResponse;
import com.bookstore.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "User registration, login, and token refresh")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "User registered successfully"),
        @ApiResponse(responseCode = "400", description = "Validation error"),
        @ApiResponse(responseCode = "409", description = "Email already registered")
    })
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive JWT tokens")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using a refresh token")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "New access token issued"),
        @ApiResponse(responseCode = "401", description = "Refresh token invalid or expired")
    })
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    @PostMapping("/cart/merge")
    @Operation(
        summary = "Merge guest cart into user cart after login",
        description = "Send localStorage cart items immediately after login. " +
                      "Quantities are summed with existing cart items, capped at stock.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Merged cart returned"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<CartResponse> mergeGuestCart(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody MergeCartRequest request) {
        return ResponseEntity.ok(authService.mergeGuestCart(principal.getUsername(), request));
    }
}
