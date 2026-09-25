-- V12: Additional books (Mystery, Thriller, more Fiction/SciFi) + improved cover image URLs
-- All prices in INR. ISBNs are standard published ISBNs.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Fix cover image URLs that are known to return 404 on Open Library ──────
-- Use OLID-based URLs where ISBN lookups are unreliable.

-- Neuromancer by William Gibson
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780441569564-L.jpg'
  WHERE isbn = '978-0-441-56956-4';

-- The Pragmatic Programmer (original) — use OLID
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg'
  WHERE isbn = '978-0-13-595705-9';

-- Fix Deep Work ISBN cover (more reliable ISBN version)
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg'
  WHERE isbn = '978-1-4555-8698-1';

-- Fix Kotlin in Action
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781617293290-L.jpg'
  WHERE isbn = '978-1-61729-329-0';

-- Fix Spark: The Definitive Guide
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781492037989-L.jpg'
  WHERE isbn = '978-1-4920-3798-2';

-- ── 2. Add Mystery & Thriller categories ─────────────────────────────────────
INSERT INTO categories (id, name, slug, description, parent_id)
VALUES
  ('b1000000-0000-0000-0000-000000000010', 'Mystery',    'mystery',
   'Mystery, detective, and crime fiction', NULL),
  ('b1000000-0000-0000-0000-000000000011', 'Thriller',   'thriller',
   'Thriller and suspense fiction', NULL)
ON CONFLICT (id) DO NOTHING;

-- ── 3. New publisher ──────────────────────────────────────────────────────────
INSERT INTO publishers (id, name, description, website)
VALUES
  ('a1000000-0000-0000-0000-000000000009', 'Bloomsbury',
   'British publishing house, home of literary fiction and nonfiction',
   'https://www.bloomsbury.com'),
  ('a1000000-0000-0000-0000-000000000010', 'HarperCollins',
   'One of the largest publishers in the world',
   'https://www.harpercollins.com')
ON CONFLICT (id) DO NOTHING;

-- ── 4. Mystery Books ─────────────────────────────────────────────────────────
INSERT INTO books (id, title, author, isbn, price, stock_quantity, cover_image_url,
                   description, page_count, language, published_date,
                   average_rating, review_count, category_id, publisher_id)
VALUES
  ('c3000000-0000-0000-0000-000000000001',
   'The Girl with the Dragon Tattoo',
   'Stieg Larsson',
   '978-0-30-726975-1',
   799, 80,
   'https://covers.openlibrary.org/b/isbn/9780307269751-L.jpg',
   'A journalist and a hacker investigate a wealthy family''s dark secrets in Sweden.',
   672, 'English', '2005-08-01', 4.55, 74000,
   'b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000005'),

  ('c3000000-0000-0000-0000-000000000002',
   'Gone Girl',
   'Gillian Flynn',
   '978-0-30-758836-5',
   749, 90,
   'https://covers.openlibrary.org/b/isbn/9780307588364-L.jpg',
   'On their fifth wedding anniversary, Amy Dunne disappears and her husband Nick becomes the prime suspect.',
   422, 'English', '2012-06-05', 4.45, 68000,
   'b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000005'),

  ('c3000000-0000-0000-0000-000000000003',
   'The Da Vinci Code',
   'Dan Brown',
   '978-0-38-550420-5',
   599, 120,
   'https://covers.openlibrary.org/b/isbn/9780385504201-L.jpg',
   'A symbologist and a cryptologist uncover a hidden history involving the Catholic Church and a secret society.',
   454, 'English', '2003-03-18', 4.35, 110000,
   'b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000005'),

  ('c3000000-0000-0000-0000-000000000004',
   'Murder on the Orient Express',
   'Agatha Christie',
   '978-0-06-207350-4',
   499, 100,
   'https://covers.openlibrary.org/b/isbn/9780062073502-L.jpg',
   'Hercule Poirot investigates a murder aboard a luxury train, where every passenger is a suspect.',
   256, 'English', '1934-01-01', 4.65, 52000,
   'b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000005'),

  ('c3000000-0000-0000-0000-000000000005',
   'The Hound of the Baskervilles',
   'Arthur Conan Doyle',
   '978-0-14-143786-6',
   449, 85,
   'https://covers.openlibrary.org/b/isbn/9780141437866-L.jpg',
   'Sherlock Holmes and Dr Watson investigate the legend of a supernatural hound haunting the Baskerville family.',
   256, 'English', '1902-04-01', 4.60, 43000,
   'b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000005')

ON CONFLICT (isbn) DO NOTHING;

-- ── 5. Thriller Books ─────────────────────────────────────────────────────────
INSERT INTO books (id, title, author, isbn, price, stock_quantity, cover_image_url,
                   description, page_count, language, published_date,
                   average_rating, review_count, category_id, publisher_id)
VALUES
  ('c3000000-0000-0000-0000-000000000006',
   'The Girl on the Train',
   'Paula Hawkins',
   '978-1-59-463445-1',
   699, 75,
   'https://covers.openlibrary.org/b/isbn/9781594634451-L.jpg',
   'A woman entangled in a missing person investigation after observing something shocking on her daily commute.',
   395, 'English', '2015-01-13', 4.30, 59000,
   'b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000005'),

  ('c3000000-0000-0000-0000-000000000007',
   'The Silent Patient',
   'Alex Michaelides',
   '978-1-25-030170-1',
   749, 85,
   'https://covers.openlibrary.org/b/isbn/9781250301703-L.jpg',
   'A famous painter shoots her husband five times and then falls silent — a criminal psychotherapist is determined to discover why.',
   336, 'English', '2019-02-05', 4.50, 48000,
   'b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000010'),

  ('c3000000-0000-0000-0000-000000000008',
   'The Woman in the Window',
   'A.J. Finn',
   '978-0-06-256562-8',
   699, 65,
   'https://covers.openlibrary.org/b/isbn/9780062565624-L.jpg',
   'An agoraphobic woman believes she witnessed a crime in the house across the street — but no one believes her.',
   427, 'English', '2018-01-02', 4.20, 35000,
   'b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000010'),

  ('c3000000-0000-0000-0000-000000000009',
   'Pet Sematary',
   'Stephen King',
   '978-1-50-115265-1',
   799, 70,
   'https://covers.openlibrary.org/b/isbn/9781501152658-L.jpg',
   'A family discovers a cemetery with terrifying powers — but some boundaries are better left uncrossed.',
   374, 'English', '1983-11-14', 4.55, 41000,
   'b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000005'),

  ('c3000000-0000-0000-0000-000000000010',
   'Misery',
   'Stephen King',
   '978-0-67-081961-7',
   699, 55,
   'https://covers.openlibrary.org/b/isbn/9780670819614-L.jpg',
   'A bestselling author survives a car crash only to be held captive by his self-described "number one fan".',
   320, 'English', '1987-06-08', 4.65, 38000,
   'b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000005')

ON CONFLICT (isbn) DO NOTHING;

-- ── 6. More Fiction / Literary titles ────────────────────────────────────────
INSERT INTO books (id, title, author, isbn, price, stock_quantity, cover_image_url,
                   description, page_count, language, published_date,
                   average_rating, review_count, category_id, publisher_id)
VALUES
  ('c3000000-0000-0000-0000-000000000011',
   'Animal Farm',
   'George Orwell',
   '978-0-45-228424-1',
   349, 200,
   'https://covers.openlibrary.org/b/isbn/9780452284241-L.jpg',
   'A satirical allegory in which farm animals overthrow their farmer and attempt to create an equal society.',
   112, 'English', '1945-08-17', 4.65, 87000,
   'b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000008'),

  ('c3000000-0000-0000-0000-000000000012',
   'A Thousand Splendid Suns',
   'Khaled Hosseini',
   '978-1-59-463193-2',
   699, 110,
   'https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg',
   'Two Afghan women from different generations whose lives are intertwined by fate, resilience, and love.',
   372, 'English', '2007-05-22', 4.80, 76000,
   'b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000007')

ON CONFLICT (isbn) DO NOTHING;

-- ── 7. Link new authors to books ──────────────────────────────────────────────
-- Add missing authors not in previous migrations
INSERT INTO authors (id, name, bio, genre, famous_works) VALUES
  ('e1000000-0000-0000-0000-000000000034',
   'Stieg Larsson',
   'Stieg Larsson (1954–2004) was a Swedish journalist and author, best known for the Millennium series. He died before his novels were published.',
   'Mystery, Crime Thriller',
   'The Girl with the Dragon Tattoo, The Girl Who Played with Fire, The Girl Who Kicked the Hornets'' Nest'),
  ('e1000000-0000-0000-0000-000000000035',
   'Gillian Flynn',
   'Gillian Flynn is an American author and former TV critic. Her psychological thriller Gone Girl spent over 100 weeks on The New York Times bestseller list.',
   'Thriller, Psychological Fiction',
   'Gone Girl, Sharp Objects, Dark Places'),
  ('e1000000-0000-0000-0000-000000000036',
   'Dan Brown',
   'Dan Brown is an American author best known for his thriller novels featuring the character Robert Langdon, including The Da Vinci Code.',
   'Thriller, Mystery',
   'The Da Vinci Code, Angels and Demons, Inferno, Origin'),
  ('e1000000-0000-0000-0000-000000000037',
   'Agatha Christie',
   'Agatha Christie (1890–1976) was a British author known as the "Queen of Crime". She is the best-selling fiction writer of all time with over two billion books sold.',
   'Mystery, Crime Fiction',
   'Murder on the Orient Express, And Then There Were None, Death on the Nile, The Murder of Roger Ackroyd'),
  ('e1000000-0000-0000-0000-000000000038',
   'Arthur Conan Doyle',
   'Arthur Conan Doyle (1859–1930) was a British author who created the fictional detective Sherlock Holmes, one of the most famous characters in literature.',
   'Mystery, Adventure',
   'The Hound of the Baskervilles, A Study in Scarlet, The Sign of the Four'),
  ('e1000000-0000-0000-0000-000000000039',
   'Paula Hawkins',
   'Paula Hawkins is a British author whose debut psychological thriller The Girl on the Train became a worldwide bestseller.',
   'Thriller, Psychological Fiction',
   'The Girl on the Train, Into the Water, A Slow Fire Burning'),
  ('e1000000-0000-0000-0000-000000000040',
   'Alex Michaelides',
   'Alex Michaelides is a British-Cypriot author and screenwriter, whose debut novel The Silent Patient became an instant #1 New York Times bestseller.',
   'Thriller, Psychological Fiction',
   'The Silent Patient, The Maidens')
ON CONFLICT (id) DO UPDATE SET
  name         = EXCLUDED.name,
  bio          = EXCLUDED.bio,
  genre        = EXCLUDED.genre,
  famous_works = EXCLUDED.famous_works;

-- Link new books to authors
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

-- Re-link Stephen King books (Pet Sematary, Misery)
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Stephen King')
  WHERE author = 'Stephen King' AND author_id IS NULL;
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'George Orwell')
  WHERE author = 'George Orwell' AND author_id IS NULL;
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Khaled Hosseini')
  WHERE author = 'Khaled Hosseini' AND author_id IS NULL;
