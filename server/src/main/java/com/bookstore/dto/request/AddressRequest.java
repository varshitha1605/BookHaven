package com.bookstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AddressRequest {

    @Size(max = 200, message = "Name must be at most 200 characters")
    private String recipientName;

    @Size(max = 20, message = "Phone number must be at most 20 characters")
    private String phoneNumber;

    @NotBlank(message = "Label is required")
    @Size(max = 100)
    private String label;

    @NotBlank(message = "Street is required")
    @Size(max = 300)
    private String street;

    @NotBlank(message = "City is required")
    @Size(max = 100)
    private String city;

    @NotBlank(message = "State is required")
    @Size(max = 100)
    private String state;

    @NotBlank(message = "Postal code is required")
    @Size(max = 20)
    private String postalCode;

    @NotBlank(message = "Country is required")
    @Size(max = 100)
    private String country;

    private boolean isDefault = false;
}
