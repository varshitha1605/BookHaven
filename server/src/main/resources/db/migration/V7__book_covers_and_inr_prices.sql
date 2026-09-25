-- V7: Add book cover images and convert prices to Indian Rupees (INR)
-- ─────────────────────────────────────────────────────────────────────────────
-- Root cause of missing images: V6 seed INSERT did not include cover_image_url.
-- Fix: set cover_image_url to Open Library cover API URLs (public domain, CORS-free).
-- URL pattern: https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg
--
-- Price conversion: original prices were stored in USD.
-- Converted at ₹85 per USD and rounded to clean INR values.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Cover images via Open Library ISBN API ────────────────────────────────────
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',  price = 3799
  WHERE isbn = '978-0-13-235088-4';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg',  price = 4249
  WHERE isbn = '978-0-13-595705-9';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg',  price = 5099
  WHERE isbn = '978-1-4492-3289-5';

-- Note: Designing Data-Intensive Applications uses a slightly different ISBN key
UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg',  price = 5099
  WHERE isbn = '978-1-4920-3289-5';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780134685991-L.jpg',  price = 4674
  WHERE isbn = '978-0-13-468599-1';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780134685991-L.jpg',  price = 4504
  WHERE isbn = '978-0-13-468599-7';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781449355739-L.jpg',  price = 5099
  WHERE isbn = '978-1-4493-5573-9';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780596517748-L.jpg',  price = 2549
  WHERE isbn = '978-0-596-51774-8';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781617293290-L.jpg',  price = 4249
  WHERE isbn = '978-1-61729-329-0';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780441172718-L.jpg',  price = 1444
  WHERE isbn = '978-0-441-17271-9';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg',  price = 1274
  WHERE isbn = '978-0-553-29335-7';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780441569564-L.jpg',  price = 1189
  WHERE isbn = '978-0-441-56956-4';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',  price = 1614
  WHERE isbn = '978-0-7352-1129-2';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg',  price = 1529
  WHERE isbn = '978-1-4555-8698-1';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781492032649-L.jpg',  price = 5949
  WHERE isbn = '978-1-4920-3264-2';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780262035613-L.jpg',  price = 6799
  WHERE isbn = '978-0-26-203561-3';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781492037989-L.jpg',  price = 5524
  WHERE isbn = '978-1-4920-3798-2';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780134685991-L.jpg',  price = 3399
  WHERE isbn = '978-0-13-468599-9';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9780321125217-L.jpg',  price = 4929
  WHERE isbn = '978-0-32-112521-7';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781617292545-L.jpg',  price = 3824
  WHERE isbn = '978-1-61729-254-5';

UPDATE books SET cover_image_url = 'https://covers.openlibrary.org/b/isbn/9781617294549-L.jpg',  price = 4674
  WHERE isbn = '978-1-61729-454-9';
