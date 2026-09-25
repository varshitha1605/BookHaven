package com.bookstore.service;

import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Lightweight helper that resolves a user's email → UUID.
 * Centralises the UserRepository lookup so controllers stay free of repository dependencies.
 */
@Service
@RequiredArgsConstructor
public class UserResolverService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UUID resolveId(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email))
                .getId();
    }
}
