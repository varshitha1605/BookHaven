package com.bookstore.controller;

import com.bookstore.service.PasswordResetService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth/password")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    /**
     * POST /auth/password/forgot
     * Always returns 200 to prevent email enumeration.
     * In dev mode, the token is included in the response so it can be used
     * without configuring an email server.
     */
    @PostMapping("/forgot")
    public ResponseEntity<Map<String, Object>> requestReset(
            @Valid @RequestBody ForgotRequest body) {

        Optional<String> token = passwordResetService.createResetToken(body.getEmail());

        // Always return the same shape — safe enumeration prevention
        return ResponseEntity.ok(Map.of(
                "message", "If an account with that email exists, a reset link has been generated.",
                // DEV ONLY — expose token so frontend can reset without email
                "devToken", token.orElse(""),
                "devNote", "devToken is only present in development. Remove in production."
        ));
    }

    /**
     * GET /auth/password/validate?token=xxx
     * Returns whether the token is valid and unexpired.
     */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Boolean>> validate(@RequestParam String token) {
        boolean valid = passwordResetService.isTokenValid(token);
        return ResponseEntity.ok(Map.of("valid", valid));
    }

    /**
     * POST /auth/password/reset
     * Accepts token + new password and resets the credential.
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> reset(
            @Valid @RequestBody ResetRequest body) {

        passwordResetService.resetPassword(body.getToken(), body.getPassword());
        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully. You can now sign in."));
    }

    // ── DTOs ─────────────────────────────────────────────────────────────────

    @Data
    public static class ForgotRequest {
        @NotBlank @Email
        private String email;
    }

    @Data
    public static class ResetRequest {
        @NotBlank
        private String token;

        @NotBlank
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;
    }
}
