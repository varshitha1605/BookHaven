package com.bookstore.controller;

import com.bookstore.dto.request.AddressRequest;
import com.bookstore.dto.response.AddressResponse;
import com.bookstore.service.AddressService;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
@Tag(name = "Addresses", description = "Saved delivery addresses")
@SecurityRequirement(name = "bearerAuth")
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    @Operation(summary = "List saved addresses for the current user")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "List of saved addresses"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<List<AddressResponse>> listAddresses(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(addressService.listForUser(principal.getUsername()));
    }

    @PostMapping
    @Operation(summary = "Add a new delivery address")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Address created"),
        @ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<AddressResponse> addAddress(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(addressService.create(principal.getUsername(), request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a saved address")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Updated address"),
        @ApiResponse(responseCode = "404", description = "Address not found")
    })
    public ResponseEntity<AddressResponse> updateAddress(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable UUID id,
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(
                addressService.update(principal.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a saved address")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Address deleted"),
        @ApiResponse(responseCode = "404", description = "Address not found")
    })
    public ResponseEntity<Void> deleteAddress(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable UUID id) {
        addressService.delete(principal.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
