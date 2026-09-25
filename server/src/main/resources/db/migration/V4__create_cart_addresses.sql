-- V4: Create addresses, carts, and cart_items tables
CREATE TABLE addresses (
    id          UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label       VARCHAR(100) NOT NULL,
    street      VARCHAR(300) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    state       VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20)  NOT NULL,
    country     VARCHAR(100) NOT NULL,
    is_default  BOOLEAN      NOT NULL DEFAULT false
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE carts (
    id         UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    UUID        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_carts_user ON carts(user_id);

-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE cart_items (
    id       UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    cart_id  UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    book_id  UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    quantity INT  NOT NULL CHECK (quantity > 0),
    UNIQUE (cart_id, book_id)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
