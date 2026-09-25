package com.bookstore.service;

import com.bookstore.entity.PasswordResetToken;
import com.bookstore.entity.User;
import com.bookstore.repository.PasswordResetTokenRepository;
import com.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Optional;

/**
 * Handles the password reset flow.
 *
 * When spring.mail.username is configured (Gmail App Password), the reset link
 * is emailed to the user and devToken is returned empty.
 *
 * When no SMTP credentials are set (local dev), the token is returned directly
 * in the API response so the developer can use it without an email server.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final int TOKEN_BYTES  = 48;
    private static final int EXPIRY_HOURS = 1;

    private final UserRepository               userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder              passwordEncoder;
    private final EmailService                 emailService;

    // ── Request reset ─────────────────────────────────────────────────────────

    /**
     * Creates a reset token for the given email and — if SMTP is configured —
     * sends the link by email. Returns the raw token only in dev mode (no SMTP).
     */
    @Transactional
    public Optional<String> createResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email.trim().toLowerCase());
        if (userOpt.isEmpty()) {
            log.info("Password reset requested for unknown email (silently ignored): {}", email);
            return Optional.empty();
        }

        User user = userOpt.get();

        // Invalidate any existing tokens for this user
        tokenRepository.deleteAllByUserId(user.getId());

        // Generate a URL-safe random token
        byte[] bytes = new byte[TOKEN_BYTES];
        new SecureRandom().nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        PasswordResetToken prt = PasswordResetToken.builder()
                .user(user)
                .token(rawToken)
                .expiresAt(Instant.now().plus(EXPIRY_HOURS, ChronoUnit.HOURS))
                .build();
        tokenRepository.save(prt);

        if (emailService.isConfigured()) {
            // Send email — async so it doesn't block the HTTP response
            emailService.sendPasswordReset(user.getEmail(), user.getFirstName(), rawToken);
            log.info("Password reset email queued for {}", email);
            // Don't expose the token in the response when email is working
            return Optional.empty();
        } else {
            // Dev mode: return token so it can be used without email
            log.info("[DEV] Password reset token for {}: {} (expires in {} hour(s))",
                    email, rawToken, EXPIRY_HOURS);
            return Optional.of(rawToken);
        }
    }

    // ── Validate token ────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public boolean isTokenValid(String token) {
        return tokenRepository.findByToken(token)
                .map(t -> !t.isExpired() && !t.isUsed())
                .orElse(false);
    }

    // ── Confirm reset ─────────────────────────────────────────────────────────

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Reset link is invalid or has already been used."));

        if (prt.isUsed()) {
            throw new IllegalArgumentException("This reset link has already been used.");
        }
        if (prt.isExpired()) {
            throw new IllegalArgumentException("This reset link has expired. Please request a new one.");
        }

        User user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        prt.setUsed(true);
        tokenRepository.save(prt);

        log.info("Password successfully reset for user: {}", user.getEmail());
    }
}
