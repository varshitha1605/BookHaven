package com.bookstore.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

/**
 * Thin wrapper around JavaMailSender.
 *
 * If spring.mail.username is not set (empty string), sending is skipped so the
 * app still works without an email server configured — the password-reset token
 * is returned in the API response instead (dev mode).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@bookhaven.local}")
    private String fromAddress;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    @Value("${app.mail.base-url:http://localhost:5173}")
    private String baseUrl;

    /** Returns true when SMTP credentials are configured. */
    public boolean isConfigured() {
        return smtpUsername != null && !smtpUsername.isBlank();
    }

    /**
     * Sends a password-reset email asynchronously.
     * Silently logs and returns if SMTP is not configured.
     */
    @Async
    public void sendPasswordReset(String toEmail, String firstName, String rawToken) {
        if (!isConfigured()) {
            log.info("[DEV] Email not configured — skipping send to {}", toEmail);
            return;
        }

        String resetLink = baseUrl + "/reset-password?token=" + rawToken;

        String html = """
                <!DOCTYPE html>
                <html lang="en">
                <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
                <body style="margin:0;padding:0;background:#faf8f3;font-family:'Segoe UI',system-ui,sans-serif">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#faf8f3;padding:40px 0">
                    <tr><td align="center">
                      <table width="560" cellpadding="0" cellspacing="0"
                             style="background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden">

                        <!-- Header -->
                        <tr>
                          <td style="background:#16324f;padding:28px 40px">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="background:#0f766e;border-radius:10px;width:36px;height:36px;
                                           text-align:center;vertical-align:middle;padding:0 8px">
                                  <span style="color:#fff;font-size:20px;font-weight:900">B</span>
                                </td>
                                <td style="padding-left:10px">
                                  <span style="color:#fff;font-size:18px;font-weight:800;letter-spacing:-0.3px">BookHaven</span><br>
                                  <span style="color:#5eead4;font-size:11px">Books for a brighter you</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                          <td style="padding:36px 40px">
                            <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#16324f">
                              Reset your password
                            </h1>
                            <p style="margin:0 0 20px;font-size:15px;color:#57606a;line-height:1.6">
                              Hi %s,<br><br>
                              We received a request to reset the password for your BookHaven account
                              (<strong>%s</strong>).<br>
                              Click the button below to choose a new password. This link expires in
                              <strong>1 hour</strong>.
                            </p>

                            <!-- CTA button -->
                            <table cellpadding="0" cellspacing="0" style="margin:28px 0">
                              <tr>
                                <td style="background:#0f766e;border-radius:12px">
                                  <a href="%s"
                                     style="display:inline-block;padding:14px 32px;font-size:15px;
                                            font-weight:700;color:#ffffff;text-decoration:none;
                                            letter-spacing:-0.2px">
                                    Reset Password →
                                  </a>
                                </td>
                              </tr>
                            </table>

                            <p style="font-size:13px;color:#57606a;line-height:1.6">
                              If the button doesn't work, copy and paste this link into your browser:<br>
                              <a href="%s" style="color:#0f766e;word-break:break-all">%s</a>
                            </p>

                            <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0">

                            <p style="font-size:12px;color:#8b949e;line-height:1.6;margin:0">
                              If you didn't request a password reset, you can safely ignore this email.
                              Your password will not be changed unless you click the link above.<br><br>
                              — The BookHaven Team
                            </p>
                          </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                          <td style="background:#f7f8fa;border-top:1px solid #e5e7eb;
                                     padding:16px 40px;text-align:center">
                            <span style="font-size:11px;color:#8b949e">
                              © 2024 BookHaven · Free shipping on orders over ₹4,000
                            </span>
                          </td>
                        </tr>

                      </table>
                    </td></tr>
                  </table>
                </body>
                </html>
                """.formatted(firstName, toEmail, resetLink, resetLink, resetLink);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress, "BookHaven");
            helper.setTo(toEmail);
            helper.setSubject("Reset your BookHaven password");
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Password-reset email sent to {}", toEmail);
        } catch (Exception ex) {
            log.error("Failed to send password-reset email to {}: {}", toEmail, ex.getMessage());
        }
    }
}
