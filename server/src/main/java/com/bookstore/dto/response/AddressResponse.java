package com.bookstore.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AddressResponse {

    private UUID id;
    private String recipientName;
    private String phoneNumber;
    private String label;
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private boolean isDefault;
}
