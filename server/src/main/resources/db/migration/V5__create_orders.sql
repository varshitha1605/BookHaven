-- V5: Create orders and order_items tables
CREATE TABLE orders (
    id                UUID           NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id           UUID           NOT NULL REFERENCES users(id),
    address_id        UUID           NOT NULL REFERENCES addresses(id),
    status            VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    payment_method    VARCHAR(20)    NOT NULL,
    payment_status    VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    stripe_payment_id VARCHAR(255),
    subtotal          NUMERIC(10, 2) NOT NULL,
    shipping_cost     NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total             NUMERIC(10, 2) NOT NULL,
    placed_at         TIMESTAMPTZ    NOT NULL DEFAULT now(),
    cancelled_at      TIMESTAMPTZ,
    cancel_reason     VARCHAR(500),

    CONSTRAINT chk_order_status
        CHECK (status IN ('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED')),
    CONSTRAINT chk_payment_method
        CHECK (payment_method IN ('CREDIT_CARD','DEBIT_CARD','PAYPAL','STRIPE')),
    CONSTRAINT chk_payment_status
        CHECK (payment_status IN ('PENDING','PAID','FAILED','REFUNDED'))
);

CREATE INDEX idx_orders_user       ON orders(user_id);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_orders_placed_at  ON orders(placed_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE order_items (
    id         UUID           NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id   UUID           NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_id    UUID           NOT NULL REFERENCES books(id),
    quantity   INT            NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
