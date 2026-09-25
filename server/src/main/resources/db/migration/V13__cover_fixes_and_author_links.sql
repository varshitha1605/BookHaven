-- V13: Fix remaining broken cover images, add missing authors, ensure all books are linked
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Add missing authors not in previous migrations ────────────────────────
INSERT INTO authors (id, name, bio, genre, famous_works) VALUES
  ('e1000000-0000-0000-0000-000000000041',
   'A.J. Finn',
   'A.J. Finn is a pen name of Daniel Mallory, a British-American author and former publisher. His debut novel The Woman in the Window was an instant bestseller.',
   'Thriller, Psychological Fiction',
   'The Woman in the Window')
ON CONFLICT (id) DO UPDATE SET
  name         = EXCLUDED.name,
  bio          = EXCLUDED.bio,
  genre        = EXCLUDED.genre,
  famous_works = EXCLUDED.famous_works;

-- ── 2. Link A.J. Finn books ──────────────────────────────────────────────────
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'A.J. Finn')
  WHERE author = 'A.J. Finn';

-- ── 3. Fix remaining unlinked books — force-update ALL books by name ──────────
-- This is safe and idempotent: re-runs update all books that match.
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Robert C. Martin')
  WHERE author = 'Robert C. Martin';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Martin Kleppmann')
  WHERE author = 'Martin Kleppmann';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Joshua Bloch')
  WHERE author = 'Joshua Bloch';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'James Clear')
  WHERE author = 'James Clear';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Frank Herbert')
  WHERE author = 'Frank Herbert';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Jane Austen')
  WHERE author = 'Jane Austen';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'George Orwell')
  WHERE author = 'George Orwell';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Paulo Coelho')
  WHERE author = 'Paulo Coelho';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Stephen King')
  WHERE author = 'Stephen King';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Khaled Hosseini')
  WHERE author = 'Khaled Hosseini';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Jojo Moyes')
  WHERE author = 'Jojo Moyes';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'John Green')
  WHERE author = 'John Green';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Colleen Hoover')
  WHERE author = 'Colleen Hoover';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Bram Stoker')
  WHERE author = 'Bram Stoker';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Mary Shelley')
  WHERE author = 'Mary Shelley';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Shirley Jackson')
  WHERE author = 'Shirley Jackson';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Harper Lee')
  WHERE author = 'Harper Lee';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'F. Scott Fitzgerald')
  WHERE author = 'F. Scott Fitzgerald';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Nicholas Sparks')
  WHERE author = 'Nicholas Sparks';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'David Thomas')
  WHERE author LIKE '%David Thomas%';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Martin Fowler')
  WHERE author = 'Martin Fowler';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Mark Lutz')
  WHERE author = 'Mark Lutz';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Douglas Crockford')
  WHERE author = 'Douglas Crockford';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Dmitry Jemerov')
  WHERE author LIKE '%Dmitry Jemerov%';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Cal Newport')
  WHERE author = 'Cal Newport';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Aurélien Géron')
  WHERE author LIKE '%Géron%' OR author LIKE '%Geron%';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Ian Goodfellow')
  WHERE author LIKE '%Goodfellow%';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Bill Chambers')
  WHERE author LIKE '%Chambers%';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Eric Evans')
  WHERE author = 'Eric Evans';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Craig Walls')
  WHERE author = 'Craig Walls';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Chris Richardson')
  WHERE author = 'Chris Richardson';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Isaac Asimov')
  WHERE author = 'Isaac Asimov';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'William Gibson')
  WHERE author = 'William Gibson';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Stieg Larsson')
  WHERE author = 'Stieg Larsson';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Gillian Flynn')
  WHERE author = 'Gillian Flynn';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Dan Brown')
  WHERE author = 'Dan Brown';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Agatha Christie')
  WHERE author = 'Agatha Christie';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Arthur Conan Doyle')
  WHERE author = 'Arthur Conan Doyle';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Paula Hawkins')
  WHERE author = 'Paula Hawkins';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Alex Michaelides')
  WHERE author = 'Alex Michaelides';

-- ── 4. Fix remaining broken / unreliable cover image URLs ────────────────────
-- Use Open Library covers by ISBN where available.
-- These are the most commonly reliable ISBN-based cover URLs.

-- Clean Code
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg'
  WHERE isbn = '978-0-13-235088-4';

-- The Pragmatic Programmer 2nd ed
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg'
  WHERE isbn = '978-0-13-595705-9';

-- Designing Data-Intensive Applications
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781449373321-L.jpg'
  WHERE isbn = '978-1-4920-3289-5';

-- Effective Java 3rd ed
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780134685991-L.jpg'
  WHERE isbn = '978-0-13-468599-7';

-- Clean Architecture
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780134494166-L.jpg'
  WHERE isbn = '978-0-13-449416-6';

-- Learning Python 5th ed
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781449355739-L.jpg'
  WHERE isbn = '978-1-4493-5573-9';

-- Kotlin in Action
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781617293290-L.jpg'
  WHERE isbn = '978-1-61729-329-0';

-- Dune
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780441172718-L.jpg'
  WHERE isbn = '978-0-441-17271-9';

-- Foundation
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg'
  WHERE isbn = '978-0-553-29335-7';

-- Atomic Habits
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg'
  WHERE isbn = '978-0-7352-1129-2';

-- Deep Work
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg'
  WHERE isbn = '978-1-4555-8698-1';

-- Hands-On ML 2nd ed
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781492032649-L.jpg'
  WHERE isbn = '978-1-4920-3264-2';

-- Domain-Driven Design
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780321125217-L.jpg'
  WHERE isbn = '978-0-32-112521-7';

-- Spring Boot in Action
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781617292545-L.jpg'
  WHERE isbn = '978-1-61729-254-5';

-- Microservices Patterns
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781617294549-L.jpg'
  WHERE isbn = '978-1-61729-454-9';

-- Neuromancer
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780441569564-L.jpg'
  WHERE isbn = '978-0-441-56956-4';

-- Spark: The Definitive Guide
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781492037989-L.jpg'
  WHERE isbn = '978-1-4920-3798-2';

-- 1984
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg'
  WHERE isbn = '978-0-45-152493-5' OR title = '1984';

-- Animal Farm
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780452284241-L.jpg'
  WHERE isbn = '978-0-45-228424-1';

-- The Kite Runner
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781594480003-L.jpg'
  WHERE isbn = '978-1-59-448000-3' OR title = 'The Kite Runner';

-- A Thousand Splendid Suns
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg'
  WHERE isbn = '978-1-59-463193-2';

-- The Alchemist
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg'
  WHERE title = 'The Alchemist';

-- The Shining
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg'
  WHERE title = 'The Shining';

-- It (Stephen King)
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781501156700-L.jpg'
  WHERE title = 'It' AND author = 'Stephen King';

-- Dracula
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780141439846-L.jpg'
  WHERE title = 'Dracula';

-- Frankenstein
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780141439471-L.jpg'
  WHERE title = 'Frankenstein';

-- The Haunting of Hill House
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780143039983-L.jpg'
  WHERE title = 'The Haunting of Hill House';

-- To Kill a Mockingbird
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780446310789-L.jpg'
  WHERE title = 'To Kill a Mockingbird';

-- The Great Gatsby
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg'
  WHERE title = 'The Great Gatsby';

-- Pride and Prejudice
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg'
  WHERE title = 'Pride and Prejudice';

-- The Fault in Our Stars
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780525478812-L.jpg'
  WHERE title = 'The Fault in Our Stars';

-- It Ends with Us
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781501110368-L.jpg'
  WHERE title = 'It Ends with Us';

-- Me Before You
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780670026609-L.jpg'
  WHERE title = 'Me Before You';

-- The Notebook
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780446605236-L.jpg'
  WHERE title = 'The Notebook';

-- Refactoring
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780134757599-L.jpg'
  WHERE title LIKE 'Refactoring%' AND author = 'Martin Fowler';

-- JavaScript: The Good Parts
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780596517748-L.jpg'
  WHERE title LIKE 'JavaScript%' AND author = 'Douglas Crockford';

-- Deep Learning (Goodfellow)
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780262035613-L.jpg'
  WHERE title = 'Deep Learning' AND author LIKE '%Goodfellow%';

-- ── 5. Ensure Romance category is fully removed and books moved to Fiction ─────
-- (Safe — V10 already did this but we re-apply idempotently)
UPDATE books
  SET category_id = 'b1000000-0000-0000-0000-000000000007'   -- Fiction
  WHERE category_id = 'b1000000-0000-0000-0000-000000000006'; -- Romance (if still exists)

DELETE FROM categories WHERE id = 'b1000000-0000-0000-0000-000000000006' AND name = 'Romance';
