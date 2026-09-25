-- V6: Seed data — publishers, categories, and books
-- Passwords below are BCrypt hashes of 'Password1!'

-- ─── Publishers ──────────────────────────────────────────────────────────────
INSERT INTO publishers (id, name, description, website) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Addison-Wesley',
   'Technical and computer science publisher',       'https://www.informit.com'),
  ('a1000000-0000-0000-0000-000000000002', 'O''Reilly Media',
   'Technology and business learning platform',      'https://www.oreilly.com'),
  ('a1000000-0000-0000-0000-000000000003', 'Pragmatic Bookshelf',
   'Books for serious developers',                   'https://pragprog.com'),
  ('a1000000-0000-0000-0000-000000000004', 'Manning Publications',
   'Practical books for software developers',        'https://www.manning.com'),
  ('a1000000-0000-0000-0000-000000000005', 'Penguin Random House',
   'General fiction and non-fiction publisher',      'https://www.penguinrandomhouse.com');

-- ─── Top-level Categories ────────────────────────────────────────────────────
INSERT INTO categories (id, name, slug, description, parent_id) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Software Engineering', 'software-engineering',
   'Books on software design, architecture, and best practices', NULL),
  ('b1000000-0000-0000-0000-000000000002', 'Programming Languages', 'programming-languages',
   'Language-specific guides and references', NULL),
  ('b1000000-0000-0000-0000-000000000003', 'Science Fiction', 'science-fiction',
   'Futuristic and speculative fiction', NULL),
  ('b1000000-0000-0000-0000-000000000004', 'Personal Development', 'personal-development',
   'Books on productivity, habits, and career growth', NULL),
  ('b1000000-0000-0000-0000-000000000005', 'Data & AI', 'data-and-ai',
   'Machine learning, data engineering, and AI', NULL);

-- ─── Books ───────────────────────────────────────────────────────────────────
INSERT INTO books (id, title, author, isbn, price, stock_quantity, description,
                   page_count, language, published_date, average_rating, review_count,
                   category_id, publisher_id) VALUES

  -- Software Engineering
  ('c1000000-0000-0000-0000-000000000001',
   'Clean Code: A Handbook of Agile Software Craftsmanship',
   'Robert C. Martin', '978-0-13-235088-4', 44.99, 80,
   'A must-read guide to writing readable, maintainable code.',
   431, 'English', '2008-08-01', 4.70, 5210,
   'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001'),

  ('c1000000-0000-0000-0000-000000000002',
   'The Pragmatic Programmer: Your Journey to Mastery',
   'David Thomas, Andrew Hunt', '978-0-13-595705-9', 49.99, 65,
   'Classic advice for software developers on becoming more effective.',
   352, 'English', '2019-09-23', 4.80, 3870,
   'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001'),

  ('c1000000-0000-0000-0000-000000000003',
   'Designing Data-Intensive Applications',
   'Martin Kleppmann', '978-1-4920-3289-5', 59.99, 45,
   'Deep dive into the principles behind reliable, scalable data systems.',
   611, 'English', '2017-03-16', 4.90, 4120,
   'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002'),

  ('c1000000-0000-0000-0000-000000000004',
   'Refactoring: Improving the Design of Existing Code',
   'Martin Fowler', '978-0-13-468599-1', 54.99, 38,
   'A comprehensive guide to refactoring code safely and systematically.',
   448, 'English', '2018-11-20', 4.60, 2640,
   'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001'),

  -- Programming Languages
  ('c1000000-0000-0000-0000-000000000005',
   'Effective Java',
   'Joshua Bloch', '978-0-13-468599-7', 52.99, 72,
   'Best practices for the Java programming language, third edition.',
   412, 'English', '2018-01-06', 4.85, 3200,
   'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001'),

  ('c1000000-0000-0000-0000-000000000006',
   'Learning Python',
   'Mark Lutz', '978-1-4493-5573-9', 59.99, 55,
   'Comprehensive Python guide covering 3.x features from basics to advanced.',
   1648, 'English', '2013-06-12', 4.40, 1890,
   'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002'),

  ('c1000000-0000-0000-0000-000000000007',
   'JavaScript: The Good Parts',
   'Douglas Crockford', '978-0-596-51774-8', 29.99, 90,
   'Distills the essence of JavaScript into a concise guide.',
   176, 'English', '2008-05-15', 4.30, 2750,
   'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002'),

  ('c1000000-0000-0000-0000-000000000008',
   'Kotlin in Action',
   'Dmitry Jemerov, Svetlana Isakova', '978-1-61729-329-0', 49.99, 40,
   'A practical guide to the Kotlin language for JVM developers.',
   360, 'English', '2017-02-19', 4.65, 980,
   'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004'),

  -- Science Fiction
  ('c1000000-0000-0000-0000-000000000009',
   'Dune',
   'Frank Herbert', '978-0-441-17271-9', 16.99, 120,
   'An epic saga of politics, religion, and ecology on a desert planet.',
   688, 'English', '1965-08-01', 4.75, 18500,
   'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000005'),

  ('c1000000-0000-0000-0000-000000000010',
   'Foundation',
   'Isaac Asimov', '978-0-553-29335-7', 14.99, 95,
   'The story of a mathematician who foresees the collapse of civilization.',
   255, 'English', '1951-05-01', 4.65, 9800,
   'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000005'),

  ('c1000000-0000-0000-0000-000000000011',
   'Neuromancer',
   'William Gibson', '978-0-441-56956-4', 13.99, 60,
   'The pioneering cyberpunk novel that defined a genre.',
   271, 'English', '1984-07-01', 4.20, 7200,
   'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000005'),

  -- Personal Development
  ('c1000000-0000-0000-0000-000000000012',
   'Atomic Habits',
   'James Clear', '978-0-7352-1129-2', 18.99, 200,
   'A proven system for building good habits and breaking bad ones.',
   320, 'English', '2018-10-16', 4.85, 32000,
   'b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000005'),

  ('c1000000-0000-0000-0000-000000000013',
   'Deep Work: Rules for Focused Success in a Distracted World',
   'Cal Newport', '978-1-4555-8698-1', 17.99, 150,
   'A compelling argument for the importance of focused, uninterrupted work.',
   296, 'English', '2016-01-05', 4.60, 14200,
   'b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000005'),

  -- Data & AI
  ('c1000000-0000-0000-0000-000000000014',
   'Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow',
   'Aurélien Géron', '978-1-4920-3264-2', 69.99, 50,
   'Practical ML guide covering concepts, tools, and techniques.',
   851, 'English', '2022-10-04', 4.90, 8900,
   'b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002'),

  ('c1000000-0000-0000-0000-000000000015',
   'Deep Learning',
   'Ian Goodfellow, Yoshua Bengio, Aaron Courville', '978-0-26-203561-3', 79.99, 30,
   'The definitive academic textbook on deep learning methods.',
   800, 'English', '2016-11-18', 4.70, 3400,
   'b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005'),

  ('c1000000-0000-0000-0000-000000000016',
   'Spark: The Definitive Guide',
   'Bill Chambers, Matei Zaharia', '978-1-4920-3798-2', 64.99, 35,
   'A comprehensive guide to Apache Spark for data engineers.',
   580, 'English', '2018-02-28', 4.50, 1800,
   'b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002'),

  -- More Software Engineering
  ('c1000000-0000-0000-0000-000000000017',
   'Clean Architecture',
   'Robert C. Martin', '978-0-13-468599-9', 39.99, 68,
   'A craftsman''s guide to software structure and design.',
   432, 'English', '2017-09-20', 4.55, 2900,
   'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001'),

  ('c1000000-0000-0000-0000-000000000018',
   'Domain-Driven Design',
   'Eric Evans', '978-0-32-112521-7', 57.99, 25,
   'Tackling complexity in the heart of software.',
   560, 'English', '2003-08-30', 4.65, 3100,
   'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001'),

  ('c1000000-0000-0000-0000-000000000019',
   'Spring Boot in Action',
   'Craig Walls', '978-1-61729-254-5', 44.99, 55,
   'A developer-focused guide to building Spring Boot applications.',
   264, 'English', '2015-12-01', 4.40, 1500,
   'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004'),

  ('c1000000-0000-0000-0000-000000000020',
   'Microservices Patterns',
   'Chris Richardson', '978-1-61729-454-9', 54.99, 42,
   'Patterns for building and deploying microservice-based applications.',
   520, 'English', '2018-11-19', 4.70, 2200,
   'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004');

-- ─── Demo users (password: Password1!) ───────────────────────────────────────
INSERT INTO users (id, email, password_hash, first_name, last_name, role) VALUES
  ('d1000000-0000-0000-0000-000000000001',
   'admin@bookstore.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
   'Admin', 'User', 'ADMIN'),
  ('d1000000-0000-0000-0000-000000000002',
   'jane.doe@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
   'Jane', 'Doe', 'USER');
