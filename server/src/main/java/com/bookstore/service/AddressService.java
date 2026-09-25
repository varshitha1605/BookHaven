package com.bookstore.service;

import com.bookstore.dto.request.AddressRequest;
import com.bookstore.dto.response.AddressResponse;
import com.bookstore.entity.Address;
import com.bookstore.entity.User;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.AddressRepository;
import com.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    // ── List ─────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<AddressResponse> listForUser(String email) {
        User user = loadUser(email);
        return addressRepository.findByUserId(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    // ── Create ────────────────────────────────────────────────────────────────

    @Transactional
    public AddressResponse create(String email, AddressRequest request) {
        User user = loadUser(email);

        // If this address is marked default, unset any existing default
        if (request.isDefault()) {
            clearDefault(user.getId());
        }

        Address address = Address.builder()
                .user(user)
                .recipientName(request.getRecipientName())
                .phoneNumber(request.getPhoneNumber())
                .label(request.getLabel())
                .street(request.getStreet())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .country(request.getCountry())
                .isDefault(request.isDefault())
                .build();

        return toResponse(addressRepository.save(address));
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Transactional
    public AddressResponse update(String email, UUID addressId, AddressRequest request) {
        User user = loadUser(email);
        Address address = loadOwnedAddress(addressId, user.getId());

        if (request.isDefault()) {
            clearDefault(user.getId());
        }

        address.setRecipientName(request.getRecipientName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setLabel(request.getLabel());
        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());
        address.setIsDefault(request.isDefault());

        return toResponse(addressRepository.save(address));
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Transactional
    public void delete(String email, UUID addressId) {
        User user = loadUser(email);
        Address address = loadOwnedAddress(addressId, user.getId());
        addressRepository.delete(address);
    }

    // ── Validate (used by OrderService at checkout) ───────────────────────────

    @Transactional(readOnly = true)
    public Address loadOwnedAddressForOrder(String email, UUID addressId) {
        User user = loadUser(email);
        return loadOwnedAddress(addressId, user.getId());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private User loadUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private Address loadOwnedAddress(UUID addressId, UUID userId) {
        return addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));
    }

    private void clearDefault(UUID userId) {
        addressRepository.findByUserId(userId).stream()
                .filter(a -> Boolean.TRUE.equals(a.getIsDefault()))
                .forEach(a -> {
                    a.setIsDefault(false);
                    addressRepository.save(a);
                });
    }

    public AddressResponse toResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .recipientName(address.getRecipientName())
                .phoneNumber(address.getPhoneNumber())
                .label(address.getLabel())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .postalCode(address.getPostalCode())
                .country(address.getCountry())
                .isDefault(Boolean.TRUE.equals(address.getIsDefault()))
                .build();
    }
}
