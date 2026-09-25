-- V3: Create books table
CREATE TABLE books (
    id               UUID           NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title            VARCHAR(500)   NOT NULL,
    author           VARCHAR(500)   NOT NULL,
    isbn             VARCHAR(20)    NOT NULL UNIQUE,
    price            NUMERIC(10, 2) NOT NULL,
    stock_quantity   INT            NOT NULL DEFAULT 0,
    cover_image_url  VARCHAR(1000),
    description      TEXT,
    page_count       INT,
    language         VARCHAR(50)    DEFAULT 'English',
    published_date   DATE,
    average_rating   NUMERIC(3, 2)  DEFAULT 0.00,
    review_count     INT            DEFAULT 0,
    category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
    publisher_id     UUID REFERENCES publishers(id) ON DELETE SET NULL
);

CREATE INDEX idx_books_category   ON books(category_id);
CREATE INDEX idx_books_publisher  ON books(publisher_id);
CREATE INDEX idx_books_author     ON books(author);
CREATE INDEX idx_books_price      ON books(price);
CREATE INDEX idx_books_rating     ON books(average_rating DESC);

-- Full-text search index on title + author + description
CREATE INDEX idx_books_fts ON books
    USING gin(to_tsvector('english', title || ' ' || author || ' ' || coalesce(description, '')));
