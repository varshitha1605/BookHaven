-- V2: Create categories and publishers tables
CREATE TABLE categories (
    id          UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name        VARCHAR(150) NOT NULL UNIQUE,
    slug        VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE publishers (
    id          UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    website     VARCHAR(255)
);
