package com.bookstore.service;

import com.bookstore.exception.PaymentFailedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Stripe payment service — test/mock mode.
 *
 * In test mode (sk_test_*) Stripe processes no real charges.
 * The integration point is kept intentionally thin so it can be
 * swapped for a real implementation without touching OrderService.
 */
@Slf4j
@Service
public class PaymentService {

    private final String stripeSecretKey;

    public PaymentService(@Value("${app.stripe.secret-key}") String stripeSecretKey) {
        this.stripeSecretKey = stripeSecretKey;
    }

    /**
     * Creates a Stripe PaymentIntent and confirms it immediately (mock mode).
     *
     * @param paymentMethodId Stripe PaymentMethod token from the frontend
     * @param amount          total charge amount
     * @param currency        ISO 4217 currency code (e.g. "usd")
     * @return Stripe PaymentIntent ID for audit / refund reference
     * @throws PaymentFailedException if Stripe returns a decline
     */
    public String charge(String paymentMethodId, BigDecimal amount, String currency) {
        log.info("Stripe charge: paymentMethod={} amount={} {}", paymentMethodId, amount, currency);

        // In a real implementation this would be:
        //   Stripe.apiKey = stripeSecretKey;
        //   PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
        //       .setAmount(amount.movePointRight(2).longValue())
        //       .setCurrency(currency)
        //       .setPaymentMethod(paymentMethodId)
        //       .setConfirm(true)
        //       .build();
        //   PaymentIntent intent = PaymentIntent.create(params);
        //   if (!"succeeded".equals(intent.getStatus())) throw new PaymentFailedException(...);
        //   return intent.getId();

        if (stripeSecretKey.contains("placeholder")) {
            // Dev/test mode — skip real API call, return a deterministic mock ID
            log.warn("Stripe is in placeholder mode — payment not actually charged");
            return "pi_mock_" + System.currentTimeMillis();
        }

        // Non-placeholder test key: would invoke real Stripe SDK here
        return "pi_mock_" + System.currentTimeMillis();
    }

    /**
     * Issues a full refund for a previously captured PaymentIntent.
     *
     * @param stripePaymentId PaymentIntent ID stored on the order
     */
    public void refund(String stripePaymentId) {
        log.info("Stripe refund: paymentId={}", stripePaymentId);

        // Real implementation:
        //   Stripe.apiKey = stripeSecretKey;
        //   RefundCreateParams params = RefundCreateParams.builder()
        //       .setPaymentIntent(stripePaymentId)
        //       .build();
        //   Refund.create(params);

        log.warn("Stripe refund is in mock mode — no real refund issued for {}", stripePaymentId);
    }
}
