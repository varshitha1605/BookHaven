-- V14: Ensure all existing users have a cart row
-- Without this, seeded demo users (admin@bookstore.com, jane.doe@example.com)
-- have no cart row. CartService.getOrCreateCart() handles this defensively,
-- but this migration pre-creates the rows to avoid any edge cases.
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO carts (user_id)
SELECT id FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM carts c WHERE c.user_id = u.id
)
ON CONFLICT DO NOTHING;
