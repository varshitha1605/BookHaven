package com.bookstore.service;

import com.bookstore.dto.request.LoginRequest;
import com.bookstore.dto.request.MergeCartRequest;
import com.bookstore.dto.request.RefreshTokenRequest;
import com.bookstore.dto.request.RegisterRequest;
import com.bookstore.dto.response.AuthResponse;
import com.bookstore.dto.response.CartResponse;
import com.bookstore.dto.response.UserSummaryResponse;
import com.bookstore.entity.Cart;
import com.bookstore.entity.User;
import com.bookstore.exception.EmailAlreadyRegisteredException;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.UserRepository;
import com.bookstore.security.JwtTokenProvider;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final CartService cartService;

    /**
     * Registers a new user, creates an empty cart for them, and returns JWT tokens.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyRegisteredException(request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(User.Role.USER)
                .build();
        userRepository.save(user);

        // Create an empty server-side cart for the new user
        Cart cart = Cart.builder().user(user).build();
        cartRepository.save(cart);

        return buildAuthResponse(user);
    }

    /**
     * Authenticates a user and returns JWT tokens.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Delegates credential validation to Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(); // already verified by AuthenticationManager

        return buildAuthResponse(user);
    }

    /**
     * Issues a new access token from a valid refresh token.
     */
    public AuthResponse refresh(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (!jwtTokenProvider.validateToken(token)) {
            throw new JwtException("Refresh token is invalid or expired");
        }

        String email = jwtTokenProvider.getSubject(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new JwtException("User not found for refresh token"));

        return buildAuthResponse(user);
    }

    /**
     * Merges a guest cart (from localStorage) into the authenticated user's server cart.
     * Called once after login, before the user reaches the main app.
     */
    @Transactional
    public CartResponse mergeGuestCart(String userEmail, MergeCartRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow();
        return cartService.mergeGuestCart(user, request.getItems());
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user) {
        String accessToken  = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(toUserSummary(user))
                .build();
    }

    private UserSummaryResponse toUserSummary(User user) {
        return UserSummaryResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .build();
    }
}
