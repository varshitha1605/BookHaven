package com.bookstore.service;

import com.bookstore.dto.request.LoginRequest;
import com.bookstore.dto.request.RegisterRequest;
import com.bookstore.dto.response.AuthResponse;
import com.bookstore.entity.Cart;
import com.bookstore.entity.User;
import com.bookstore.exception.EmailAlreadyRegisteredException;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.UserRepository;
import com.bookstore.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private CartRepository cartRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private CartService cartService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private User savedUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setEmail("jane@example.com");
        registerRequest.setPassword("Password1!");
        registerRequest.setFirstName("Jane");
        registerRequest.setLastName("Doe");

        savedUser = User.builder()
                .id(UUID.randomUUID())
                .email("jane@example.com")
                .passwordHash("hashed")
                .firstName("Jane")
                .lastName("Doe")
                .role(User.Role.USER)
                .build();
    }

    @Test
    void register_success_returnsTokens() {
        when(userRepository.existsByEmail("jane@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password1!")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(cartRepository.save(any(Cart.class))).thenReturn(Cart.builder().user(savedUser).build());
        when(jwtTokenProvider.generateAccessToken("jane@example.com")).thenReturn("access-token");
        when(jwtTokenProvider.generateRefreshToken("jane@example.com")).thenReturn("refresh-token");

        AuthResponse response = authService.register(registerRequest);

        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
        assertThat(response.getTokenType()).isEqualTo("Bearer");
        assertThat(response.getUser().getEmail()).isEqualTo("jane@example.com");

        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    void register_duplicateEmail_throwsConflict() {
        when(userRepository.existsByEmail("jane@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(EmailAlreadyRegisteredException.class)
                .hasMessageContaining("jane@example.com");

        verify(userRepository, never()).save(any());
        verify(cartRepository, never()).save(any());
    }

    @Test
    void login_validCredentials_returnsTokens() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("jane@example.com");
        loginRequest.setPassword("Password1!");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null); // AuthenticationManager returns Authentication, null is fine for mock
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(savedUser));
        when(jwtTokenProvider.generateAccessToken("jane@example.com")).thenReturn("access-token");
        when(jwtTokenProvider.generateRefreshToken("jane@example.com")).thenReturn("refresh-token");

        AuthResponse response = authService.login(loginRequest);

        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getUser().getEmail()).isEqualTo("jane@example.com");
    }

    @Test
    void refresh_validToken_returnsNewAccessToken() {
        com.bookstore.dto.request.RefreshTokenRequest req =
                new com.bookstore.dto.request.RefreshTokenRequest();
        req.setRefreshToken("valid-refresh");

        when(jwtTokenProvider.validateToken("valid-refresh")).thenReturn(true);
        when(jwtTokenProvider.getSubject("valid-refresh")).thenReturn("jane@example.com");
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(savedUser));
        when(jwtTokenProvider.generateAccessToken("jane@example.com")).thenReturn("new-access-token");
        when(jwtTokenProvider.generateRefreshToken("jane@example.com")).thenReturn("new-refresh-token");

        AuthResponse response = authService.refresh(req);

        assertThat(response.getAccessToken()).isEqualTo("new-access-token");
    }

    @Test
    void refresh_invalidToken_throwsJwtException() {
        com.bookstore.dto.request.RefreshTokenRequest req =
                new com.bookstore.dto.request.RefreshTokenRequest();
        req.setRefreshToken("bad-token");

        when(jwtTokenProvider.validateToken("bad-token")).thenReturn(false);

        assertThatThrownBy(() -> authService.refresh(req))
                .isInstanceOf(io.jsonwebtoken.JwtException.class);
    }
}
