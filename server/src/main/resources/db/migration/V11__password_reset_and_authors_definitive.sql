-- V11: Password reset tokens + definitive authors fix
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Password reset tokens ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(64) NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    used        BOOLEAN     NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prt_token   ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_prt_user    ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_prt_expires ON password_reset_tokens(expires_at);

-- ── 2. Authors — definitive idempotent insert ─────────────────────────────────
-- Using ON CONFLICT (id) DO UPDATE so it always sets the correct data,
-- even if V9/V10 previously inserted a partial row.

INSERT INTO authors (id, name, bio, genre, famous_works) VALUES
  ('e1000000-0000-0000-0000-000000000001',
   'Robert C. Martin',
   'Robert C. Martin, known as "Uncle Bob", is an American software engineer and author. He is a co-author of the Agile Manifesto and a prominent advocate for software craftsmanship, clean code, and SOLID design principles.',
   'Software Engineering',
   'Clean Code, Clean Architecture, The Clean Coder, Agile Software Development'),
  ('e1000000-0000-0000-0000-000000000002',
   'Martin Kleppmann',
   'Martin Kleppmann is a British computer scientist and author, known for his research on distributed systems and stream processing. He is a research fellow at Cambridge University and creator of the CRDT-based text editor Automerge.',
   'Distributed Systems, Data Engineering',
   'Designing Data-Intensive Applications'),
  ('e1000000-0000-0000-0000-000000000003',
   'Joshua Bloch',
   'Joshua Bloch is an American software engineer who led the design and implementation of numerous Java platform features at Sun Microsystems. He is a former principal engineer at Google and author of the widely respected Effective Java.',
   'Programming Languages, Java',
   'Effective Java, Java Puzzlers'),
  ('e1000000-0000-0000-0000-000000000004',
   'James Clear',
   'James Clear is an American author and speaker known for his work on habits, decision-making, and continuous improvement. His book Atomic Habits has sold over 15 million copies worldwide.',
   'Personal Development, Habits',
   'Atomic Habits'),
  ('e1000000-0000-0000-0000-000000000005',
   'Frank Herbert',
   'Frank Herbert (1920–1986) was an American science fiction author best known for the Dune series, one of the best-selling science fiction franchises of all time. He worked as a journalist before writing science fiction.',
   'Science Fiction',
   'Dune, Children of Dune, God Emperor of Dune'),
  ('e1000000-0000-0000-0000-000000000006',
   'Jane Austen',
   'Jane Austen (1775–1817) was an English novelist known for her sharp social commentary and romantic fiction. Her works critique the role of women in Georgian society and remain among the most widely read novels in English literature.',
   'Classic Literature, Fiction',
   'Pride and Prejudice, Sense and Sensibility, Emma, Persuasion'),
  ('e1000000-0000-0000-0000-000000000007',
   'George Orwell',
   'George Orwell (1903–1950) was an English novelist, essayist, and critic. His work is characterised by lucid prose, social criticism, and opposition to totalitarianism.',
   'Fiction, Dystopian, Political Satire',
   '1984, Animal Farm, Homage to Catalonia'),
  ('e1000000-0000-0000-0000-000000000008',
   'Paulo Coelho',
   'Paulo Coelho is a Brazilian lyricist and novelist, best known for The Alchemist. His books have been translated into 80 languages and he has sold over 225 million copies worldwide.',
   'Fiction, Philosophical Fiction',
   'The Alchemist, Brida, The Valkyries, Veronika Decides to Die'),
  ('e1000000-0000-0000-0000-000000000009',
   'Stephen King',
   'Stephen King is an American author of horror, supernatural fiction, suspense, crime, science fiction, and fantasy. His books have sold more than 350 million copies.',
   'Horror, Thriller, Supernatural Fiction',
   'The Shining, It, Carrie, Pet Sematary, Misery, The Stand'),
  ('e1000000-0000-0000-0000-000000000010',
   'Khaled Hosseini',
   'Khaled Hosseini is an Afghan-American novelist and physician. His debut novel The Kite Runner was one of the best-selling novels of the 2000s. He serves as a UNHCR Goodwill Ambassador.',
   'Fiction, Literary Fiction',
   'The Kite Runner, A Thousand Splendid Suns, And the Mountains Echoed'),
  ('e1000000-0000-0000-0000-000000000011',
   'Jojo Moyes',
   'Jojo Moyes is a British author and journalist who writes romance and literary fiction. She is one of only two authors to have won the Romantic Novel of the Year award twice.',
   'Literary Fiction',
   'Me Before You, After You, Still Me, The Giver of Stars'),
  ('e1000000-0000-0000-0000-000000000012',
   'John Green',
   'John Green is an American author of young adult fiction, a video blogger, and a podcaster. His novels explore themes of love, coming-of-age, and existential questioning.',
   'Young Adult Fiction',
   'The Fault in Our Stars, Looking for Alaska, Paper Towns, Turtles All the Way Down'),
  ('e1000000-0000-0000-0000-000000000013',
   'Colleen Hoover',
   'Colleen Hoover is an American author known for her new adult romance and young adult fiction novels. She self-published her first novel in 2012 and became one of the most popular romance authors.',
   'Literary Fiction, New Adult Fiction',
   'It Ends with Us, Ugly Love, Verity, November 9, Confess'),
  ('e1000000-0000-0000-0000-000000000014',
   'Bram Stoker',
   'Bram Stoker (1847–1912) was an Irish author best known for writing the Gothic horror novel Dracula, published in 1897.',
   'Gothic Horror, Victorian Fiction',
   'Dracula, The Jewel of Seven Stars, The Lair of the White Worm'),
  ('e1000000-0000-0000-0000-000000000015',
   'Mary Shelley',
   'Mary Shelley (1797–1851) was an English novelist who wrote Frankenstein, widely regarded as the first modern science fiction novel.',
   'Gothic Horror, Science Fiction',
   'Frankenstein, The Last Man, Valperga'),
  ('e1000000-0000-0000-0000-000000000016',
   'Shirley Jackson',
   'Shirley Jackson (1916–1965) was an American author known for her work in horror and mystery. The Haunting of Hill House is considered one of the finest horror novels ever written.',
   'Horror, Psychological Thriller',
   'The Haunting of Hill House, We Have Always Lived in the Castle, The Lottery'),
  ('e1000000-0000-0000-0000-000000000017',
   'Harper Lee',
   'Harper Lee (1926–2016) was an American novelist best known for To Kill a Mockingbird, which won the Pulitzer Prize in 1961.',
   'Literary Fiction, Social Commentary',
   'To Kill a Mockingbird, Go Set a Watchman'),
  ('e1000000-0000-0000-0000-000000000018',
   'F. Scott Fitzgerald',
   'F. Scott Fitzgerald (1896–1940) was an American novelist, widely regarded as one of the greatest writers of the twentieth century.',
   'Literary Fiction, American Classic',
   'The Great Gatsby, Tender Is the Night, This Side of Paradise'),
  ('e1000000-0000-0000-0000-000000000019',
   'Nicholas Sparks',
   'Nicholas Sparks is an American novelist and screenwriter. He has had several of his books turned into popular films, including The Notebook and A Walk to Remember.',
   'Fiction',
   'The Notebook, A Walk to Remember, Message in a Bottle, Dear John'),
  ('e1000000-0000-0000-0000-000000000020',
   'David Thomas',
   'David Thomas is an American software engineer and author. Together with Andrew Hunt, he co-authored The Pragmatic Programmer, one of the most influential books in software development.',
   'Software Engineering',
   'The Pragmatic Programmer, Programming Ruby'),
  ('e1000000-0000-0000-0000-000000000021',
   'Mark Lutz',
   'Mark Lutz is an American software developer and author who has written several comprehensive guides to the Python programming language.',
   'Programming Languages, Python',
   'Learning Python, Programming Python, Python Pocket Reference'),
  ('e1000000-0000-0000-0000-000000000022',
   'Douglas Crockford',
   'Douglas Crockford is an American computer programmer and entrepreneur who popularized the data format JSON and is the author of JavaScript: The Good Parts.',
   'Programming Languages, JavaScript',
   'JavaScript: The Good Parts'),
  ('e1000000-0000-0000-0000-000000000023',
   'Cal Newport',
   'Cal Newport is an American non-fiction author and a computer science professor at Georgetown University. He is known for his work on productivity and the value of deep work.',
   'Personal Development, Productivity',
   'Deep Work, So Good They Can''t Ignore You, Digital Minimalism'),
  ('e1000000-0000-0000-0000-000000000024',
   'Aurélien Géron',
   'Aurélien Géron is a French machine learning consultant and author. He is widely known for his hands-on guide to machine learning with Scikit-Learn and TensorFlow.',
   'Data Science, Machine Learning, AI',
   'Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow'),
  ('e1000000-0000-0000-0000-000000000025',
   'Martin Fowler',
   'Martin Fowler is a British software developer, author, and international speaker on software development, specialising in object-oriented analysis and design, UML, and agile methods.',
   'Software Engineering',
   'Refactoring, Patterns of Enterprise Application Architecture, UML Distilled'),
  ('e1000000-0000-0000-0000-000000000026',
   'Eric Evans',
   'Eric Evans is an American software engineer and author who coined the term Domain-Driven Design (DDD) and wrote the definitive book on the subject.',
   'Software Engineering, Architecture',
   'Domain-Driven Design, Domain-Driven Design Reference'),
  ('e1000000-0000-0000-0000-000000000027',
   'Craig Walls',
   'Craig Walls is an American software developer and author who has written several practical guides to Spring Framework and Spring Boot.',
   'Java, Spring Framework',
   'Spring Boot in Action, Spring in Action'),
  ('e1000000-0000-0000-0000-000000000028',
   'Chris Richardson',
   'Chris Richardson is an American software architect, author, and consultant who is a pioneer of microservices architecture.',
   'Software Architecture, Microservices',
   'Microservices Patterns, POJOs in Action'),
  ('e1000000-0000-0000-0000-000000000029',
   'Isaac Asimov',
   'Isaac Asimov (1920–1992) was an American writer and professor of biochemistry, best known for his science fiction works. He was one of the most prolific science fiction authors of all time.',
   'Science Fiction',
   'Foundation, I Robot, The End of Eternity, The Gods Themselves'),
  ('e1000000-0000-0000-0000-000000000030',
   'William Gibson',
   'William Gibson is a Canadian-American speculative fiction novelist who coined the term "cyberspace" and is considered the father of the cyberpunk subgenre.',
   'Science Fiction, Cyberpunk',
   'Neuromancer, Count Zero, Mona Lisa Overdrive, Pattern Recognition'),
  ('e1000000-0000-0000-0000-000000000031',
   'Ian Goodfellow',
   'Ian Goodfellow is an American computer scientist, engineer, and executive. He is best known for inventing generative adversarial networks (GANs) and co-authoring the Deep Learning textbook.',
   'Deep Learning, AI Research',
   'Deep Learning'),
  ('e1000000-0000-0000-0000-000000000032',
   'Bill Chambers',
   'Bill Chambers is a data engineer and author who co-authored Spark: The Definitive Guide.',
   'Data Engineering',
   'Spark: The Definitive Guide'),
  ('e1000000-0000-0000-0000-000000000033',
   'Dmitry Jemerov',
   'Dmitry Jemerov is a software engineer at JetBrains who co-authored Kotlin in Action, the first comprehensive book on the Kotlin programming language.',
   'Programming Languages, Kotlin',
   'Kotlin in Action')
ON CONFLICT (id) DO UPDATE SET
  name         = EXCLUDED.name,
  bio          = EXCLUDED.bio,
  genre        = EXCLUDED.genre,
  famous_works = EXCLUDED.famous_works;

-- ── 3. Definitively link all books to their authors ───────────────────────────
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Robert C. Martin')
  WHERE author = 'Robert C. Martin';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'David Thomas')
  WHERE author LIKE '%David Thomas%';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Martin Kleppmann')
  WHERE author = 'Martin Kleppmann';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Martin Fowler')
  WHERE author = 'Martin Fowler';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Joshua Bloch')
  WHERE author = 'Joshua Bloch';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Mark Lutz')
  WHERE author = 'Mark Lutz';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Douglas Crockford')
  WHERE author = 'Douglas Crockford';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Dmitry Jemerov')
  WHERE author LIKE '%Dmitry Jemerov%';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Frank Herbert')
  WHERE author = 'Frank Herbert';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Isaac Asimov')
  WHERE author = 'Isaac Asimov';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'William Gibson')
  WHERE author = 'William Gibson';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'James Clear')
  WHERE author = 'James Clear';
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
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Jane Austen')
  WHERE author = 'Jane Austen';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Nicholas Sparks')
  WHERE author = 'Nicholas Sparks';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Jojo Moyes')
  WHERE author = 'Jojo Moyes';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'John Green')
  WHERE author = 'John Green';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Colleen Hoover')
  WHERE author = 'Colleen Hoover';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Paulo Coelho')
  WHERE author = 'Paulo Coelho';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'George Orwell')
  WHERE author = 'George Orwell';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'F. Scott Fitzgerald')
  WHERE author = 'F. Scott Fitzgerald';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Khaled Hosseini')
  WHERE author = 'Khaled Hosseini';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Harper Lee')
  WHERE author = 'Harper Lee';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Bram Stoker')
  WHERE author = 'Bram Stoker';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Mary Shelley')
  WHERE author = 'Mary Shelley';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Stephen King')
  WHERE author = 'Stephen King';
UPDATE books SET author_id = (SELECT id FROM authors WHERE name = 'Shirley Jackson')
  WHERE author = 'Shirley Jackson';
