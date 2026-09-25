-- V8: Add Romance, Fiction, Horror categories + books
-- Also fixes several V7 image URLs that return 404 from Open Library.
-- All prices are in INR. ISBNs used are widely available in Open Library.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Fix V7 image URLs that do not resolve on Open Library ─────────────────
-- The ISBN key must match the book's registered cover on Open Library.
-- These replacements use OL Work IDs (covers.openlibrary.org/b/id/...) as fallback
-- where ISBN lookups fail, or use a corrected ISBN.

-- Clean Code — ISBN 9780132350884 resolves fine, keep.
-- The Pragmatic Programmer (2nd ed) — ISBN 9780135957059 resolves fine.
-- Designing Data-Intensive Applications — original ISBN in seed is 978-1-4920-3289-5
--   but the correct paperback ISBN is 9781449373321
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781449373321-L.jpg'
  WHERE isbn = '978-1-4920-3289-5';

-- Effective Java 3rd ed — ISBN 9780134685991 is used multiple times; use OLID cover
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/olid/OL26432929M-L.jpg'
  WHERE isbn = '978-0-13-468599-7';   -- Effective Java

-- Learning Python 5th ed — 9781449355739
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781449355739-L.jpg'
  WHERE isbn = '978-1-4493-5573-9';

-- Kotlin in Action — 9781617293290
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781617293290-L.jpg'
  WHERE isbn = '978-1-61729-329-0';

-- Dune — 9780441172718
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780441172718-L.jpg'
  WHERE isbn = '978-0-441-17271-9';

-- Foundation — 9780553293357
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg'
  WHERE isbn = '978-0-553-29335-7';

-- Atomic Habits — 9780735211292
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg'
  WHERE isbn = '978-0-7352-1129-2';

-- Deep Work — 9781455586691
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg'
  WHERE isbn = '978-1-4555-8698-1';

-- Hands-On ML — 9781492032649
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781492032649-L.jpg'
  WHERE isbn = '978-1-4920-3264-2';

-- Clean Architecture — 9780134494166 (the correct ISBN for Clean Architecture)
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780134494166-L.jpg',
                 isbn = '978-0-13-449416-6'
  WHERE isbn = '978-0-13-468599-9';

-- Domain-Driven Design — 9780321125217
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780321125217-L.jpg'
  WHERE isbn = '978-0-32-112521-7';

-- Spring Boot in Action — 9781617292545
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781617292545-L.jpg'
  WHERE isbn = '978-1-61729-254-5';

-- Microservices Patterns — 9781617294549
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781617294549-L.jpg'
  WHERE isbn = '978-1-61729-454-9';

-- ── 2. New Publishers ─────────────────────────────────────────────────────────
INSERT INTO publishers (id, name, description, website)
VALUES
  ('a1000000-0000-0000-0000-000000000006', 'Scribner',
   'Imprint of Simon & Schuster, publishing literary fiction and classics',
   'https://www.simonandschuster.com'),
  ('a1000000-0000-0000-0000-000000000007', 'Picador',
   'Pan Macmillan literary fiction imprint',
   'https://www.panmacmillan.com'),
  ('a1000000-0000-0000-0000-000000000008', 'Secker & Warburg',
   'Literary fiction and classics publisher',
   'https://www.penguin.co.uk')
ON CONFLICT (id) DO NOTHING;

-- ── 3. New Categories ────────────────────────────────────────────────────────
INSERT INTO categories (id, name, slug, description, parent_id)
VALUES
  ('b1000000-0000-0000-0000-000000000006', 'Romance',      'romance',
   'Love stories and romantic fiction', NULL),
  ('b1000000-0000-0000-0000-000000000007', 'Fiction',      'fiction',
   'Literary fiction and classic novels', NULL),
  ('b1000000-0000-0000-0000-000000000008', 'Horror',       'horror',
   'Horror, gothic, and suspense fiction', NULL),
  ('b1000000-0000-0000-0000-000000000009', 'Programming',  'programming',
   'Practical programming guides and tutorials', NULL)
ON CONFLICT (id) DO NOTHING;

-- ── 4. Romance Books ─────────────────────────────────────────────────────────
INSERT INTO books (id, title, author, isbn, price, stock_quantity, cover_image_url,
                   description, page_count, language, published_date,
                   average_rating, review_count, category_id, publisher_id)
VALUES
  ('c2000000-0000-0000-0000-000000000001',
   'Pride and Prejudice',
   'Jane Austen',
   '978-0-14-143951-8',
   499, 150,
   'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
   'The story of the headstrong Elizabeth Bennet and the proud Mr. Darcy — one of the greatest love stories ever told.',
   432, 'English', '1813-01-28', 4.90, 58000,
   'b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000005'),

  ('c2000000-0000-0000-0000-000000000002',
   'The Notebook',
   'Nicholas Sparks',
   '978-0-44-661780-1',
   699, 120,
   'https://covers.openlibrary.org/b/isbn/9780446617802-L.jpg',
   'An enduring love story of two young people from different backgrounds who defy the odds.',
   214, 'English', '1996-10-01', 4.50, 41000,
   'b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000005'),

  ('c2000000-0000-0000-0000-000000000003',
   'Me Before You',
   'Jojo Moyes',
   '978-0-14-312454-4',
   799, 100,
   'https://covers.openlibrary.org/b/isbn/9780143124542-L.jpg',
   'A young woman caring for a quadriplegic man discovers life, love, and difficult choices.',
   369, 'English', '2012-01-05', 4.55, 63000,
   'b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000005'),

  ('c2000000-0000-0000-0000-000000000004',
   'The Fault in Our Stars',
   'John Green',
   '978-0-14-242417-1',
   649, 130,
   'https://covers.openlibrary.org/b/isbn/9780142424179-L.jpg',
   'Two teenagers with cancer fall in love and grapple with the big questions of life.',
   313, 'English', '2012-01-10', 4.65, 92000,
   'b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000005'),

  ('c2000000-0000-0000-0000-000000000005',
   'It Ends with Us',
   'Colleen Hoover',
   '978-1-50-117207-9',
   749, 140,
   'https://covers.openlibrary.org/b/isbn/9781501172076-L.jpg',
   'A story of love, courage, and the reality of heartbreak that dares to tackle a difficult subject with honesty and grace.',
   376, 'English', '2016-08-02', 4.70, 178000,
   'b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000005')

ON CONFLICT (isbn) DO NOTHING;

-- ── 5. Fiction Books ──────────────────────────────────────────────────────────
INSERT INTO books (id, title, author, isbn, price, stock_quantity, cover_image_url,
                   description, page_count, language, published_date,
                   average_rating, review_count, category_id, publisher_id)
VALUES
  ('c2000000-0000-0000-0000-000000000006',
   'The Alchemist',
   'Paulo Coelho',
   '978-0-06-231609-7',
   599, 200,
   'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
   'A shepherd boy travels from Spain to Egypt in search of a treasure, discovering the meaning of his Personal Legend along the way.',
   208, 'English', '1988-01-01', 4.65, 127000,
   'b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000005'),

  ('c2000000-0000-0000-0000-000000000007',
   '1984',
   'George Orwell',
   '978-0-45-228423-4',
   549, 180,
   'https://covers.openlibrary.org/b/isbn/9780452284234-L.jpg',
   'A chilling portrait of a totalitarian society where Big Brother watches your every move and free thought is a crime.',
   328, 'English', '1949-06-08', 4.75, 113000,
   'b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000008'),

  ('c2000000-0000-0000-0000-000000000008',
   'The Great Gatsby',
   'F. Scott Fitzgerald',
   '978-0-74-327356-5',
   499, 160,
   'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
   'The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, set in the Jazz Age.',
   180, 'English', '1925-04-10', 4.50, 79000,
   'b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000006'),

  ('c2000000-0000-0000-0000-000000000009',
   'The Kite Runner',
   'Khaled Hosseini',
   '978-1-59-463193-1',
   649, 140,
   'https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg',
   'A powerful story of a privileged boy and his servant''s son whose friendship shatters after a traumatic incident.',
   372, 'English', '2003-05-29', 4.70, 89000,
   'b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000007'),

  ('c2000000-0000-0000-0000-000000000010',
   'To Kill a Mockingbird',
   'Harper Lee',
   '978-0-06-112008-4',
   549, 175,
   'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
   'A coming-of-age story set in the American South, seen through the eyes of Scout Finch as her lawyer father defends a Black man accused of a crime.',
   281, 'English', '1960-07-11', 4.80, 105000,
   'b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000005')

ON CONFLICT (isbn) DO NOTHING;

-- ── 6. Horror Books ───────────────────────────────────────────────────────────
INSERT INTO books (id, title, author, isbn, price, stock_quantity, cover_image_url,
                   description, page_count, language, published_date,
                   average_rating, review_count, category_id, publisher_id)
VALUES
  ('c2000000-0000-0000-0000-000000000011',
   'Dracula',
   'Bram Stoker',
   '978-0-14-143984-6',
   449, 90,
   'https://covers.openlibrary.org/b/isbn/9780141439846-L.jpg',
   'The gothic novel that introduced the world to Count Dracula, told through letters and diary entries.',
   418, 'English', '1897-05-26', 4.65, 38000,
   'b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000005'),

  ('c2000000-0000-0000-0000-000000000012',
   'Frankenstein',
   'Mary Shelley',
   '978-0-14-143947-1',
   449, 85,
   'https://covers.openlibrary.org/b/isbn/9780141439471-L.jpg',
   'Victor Frankenstein''s creation of a creature and the horrific consequences that follow — the original science fiction horror.',
   280, 'English', '1818-01-01', 4.60, 47000,
   'b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000005'),

  ('c2000000-0000-0000-0000-000000000013',
   'The Shining',
   'Stephen King',
   '978-0-30-747473-0',
   799, 95,
   'https://covers.openlibrary.org/b/isbn/9780307474728-L.jpg',
   'A family becomes the winter caretakers of an isolated hotel, and the father''s sanity slowly unravels under supernatural forces.',
   447, 'English', '1977-01-28', 4.75, 72000,
   'b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000005'),

  ('c2000000-0000-0000-0000-000000000014',
   'It',
   'Stephen King',
   '978-1-50-115270-5',
   999, 75,
   'https://covers.openlibrary.org/b/isbn/9781501152702-L.jpg',
   'Seven children encounter a shape-shifting monster in the town of Derry — and must face it again as adults twenty-seven years later.',
   1138, 'English', '1986-09-15', 4.70, 58000,
   'b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000005'),

  ('c2000000-0000-0000-0000-000000000015',
   'The Haunting of Hill House',
   'Shirley Jackson',
   '978-0-14-303998-1',
   599, 65,
   'https://covers.openlibrary.org/b/isbn/9780143039983-L.jpg',
   'Four people explore a notoriously haunted house and encounter psychic terror that may be external — or internal.',
   246, 'English', '1959-10-16', 4.60, 29000,
   'b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000005')

ON CONFLICT (isbn) DO NOTHING;

-- ── 7. Programming category books (alias for existing prog lang books) ────────
-- Map some existing Programming Languages books to new Programming category
-- (new books, not updating existing — avoid breaking existing category filter)
INSERT INTO books (id, title, author, isbn, price, stock_quantity, cover_image_url,
                   description, page_count, language, published_date,
                   average_rating, review_count, category_id, publisher_id)
VALUES
  ('c2000000-0000-0000-0000-000000000016',
   'The Pragmatic Programmer: 20th Anniversary Edition',
   'David Thomas, Andrew Hunt',
   '978-0-13-595705-8',
   3999, 60,
   'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg',
   'Revised anniversary edition of the classic guide — updated with new tips for modern development.',
   352, 'English', '2019-09-23', 4.80, 4100,
   'b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000001')

ON CONFLICT (isbn) DO NOTHING;
