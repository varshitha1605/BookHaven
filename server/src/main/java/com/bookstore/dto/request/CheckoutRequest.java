package com.bookstore.dto.request;

import com.bookstore.entity.Order;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CheckoutRequest {

    @NotNull(message = "Address ID is required")
    private UUID addressId;

    @NotNull(message = "Payment method is required")
    private Order.PaymentMethod paymentMethod;

    /**
     * Required when paymentMethod is CREDIT_CARD or DEBIT_CARD.
     * Contains the Stripe PaymentMethod token from the frontend.
     */
    private String stripePaymentMethodId;
}
