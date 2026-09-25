package com.bookstore.service;

import com.bookstore.dto.request.AddressRequest;
import com.bookstore.dto.response.AddressResponse;
import com.bookstore.entity.Address;
import com.bookstore.entity.User;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.AddressRepository;
import com.bookstore.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AddressServiceTest {

    @Mock private AddressRepository addressRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private AddressService addressService;

    private User user;
    private UUID userId;
    private Address address;
    private UUID addressId;

    @BeforeEach
    void setUp() {
        userId    = UUID.randomUUID();
        addressId = UUID.randomUUID();

        user = User.builder()
                .id(userId)
                .email("jane@example.com")
                .build();

        address = Address.builder()
                .id(addressId)
                .user(user)
                .label("Home")
                .street("123 Main St")
                .city("Springfield")
                .state("IL")
                .postalCode("62701")
                .country("US")
                .isDefault(false)
                .build();
    }

    @Test
    void listForUser_returnsAddresses() {
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(addressRepository.findByUserId(userId)).thenReturn(List.of(address));

        List<AddressResponse> result = addressService.listForUser("jane@example.com");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getLabel()).isEqualTo("Home");
    }

    @Test
    void create_nonDefaultAddress_savedSuccessfully() {
        AddressRequest request = buildRequest(false);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(addressRepository.save(any(Address.class))).thenReturn(address);

        AddressResponse response = addressService.create("jane@example.com", request);

        assertThat(response.getLabel()).isEqualTo("Home");
        // clearDefault is gated on isDefault=true, so save is only called once (for the new address)
        verify(addressRepository, times(1)).save(any(Address.class));
    }

    @Test
    void create_defaultAddress_clearsExistingDefault() {
        AddressRequest request = buildRequest(true);

        Address existingDefault = Address.builder()
                .id(UUID.randomUUID()).user(user)
                .label("Work").street("456 Office Ave").city("Chicago")
                .state("IL").postalCode("60601").country("US").isDefault(true)
                .build();

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(addressRepository.findByUserId(userId)).thenReturn(List.of(existingDefault));
        when(addressRepository.save(any(Address.class))).thenReturn(address);

        addressService.create("jane@example.com", request);

        assertThat(existingDefault.getIsDefault()).isFalse();
        verify(addressRepository, atLeastOnce()).save(existingDefault);
    }

    @Test
    void delete_ownedAddress_deletesSuccessfully() {
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(addressRepository.findByIdAndUserId(addressId, userId))
                .thenReturn(Optional.of(address));

        addressService.delete("jane@example.com", addressId);

        verify(addressRepository).delete(address);
    }

    @Test
    void delete_addressNotOwnedByUser_throws404() {
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(addressRepository.findByIdAndUserId(addressId, userId))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> addressService.delete("jane@example.com", addressId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Address");
    }

    @Test
    void update_changesFields() {
        AddressRequest request = new AddressRequest();
        request.setLabel("Office");
        request.setStreet("789 Business Rd");
        request.setCity("Chicago");
        request.setState("IL");
        request.setPostalCode("60601");
        request.setCountry("US");
        request.setDefault(false);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(addressRepository.findByIdAndUserId(addressId, userId))
                .thenReturn(Optional.of(address));
        when(addressRepository.save(any(Address.class))).thenReturn(address);

        AddressResponse response = addressService.update("jane@example.com", addressId, request);

        assertThat(address.getLabel()).isEqualTo("Office");
        assertThat(address.getCity()).isEqualTo("Chicago");
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private AddressRequest buildRequest(boolean isDefault) {
        AddressRequest req = new AddressRequest();
        req.setLabel("Home");
        req.setStreet("123 Main St");
        req.setCity("Springfield");
        req.setState("IL");
        req.setPostalCode("62701");
        req.setCountry("US");
        req.setDefault(isDefault);
        return req;
    }
}
