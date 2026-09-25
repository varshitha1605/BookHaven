-- V9: Add authors table and link books to authors
-- Author biography data is provided as verified, factual summary information.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS authors (
    id              UUID            NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name            VARCHAR(500)    NOT NULL UNIQUE,
    bio             TEXT,
    genre           VARCHAR(200),
    famous_works    TEXT,
    photo_url       VARCHAR(1000)
);

ALTER TABLE books ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES authors(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_books_author_id ON books(author_id);

-- ── Seed known authors ────────────────────────────────────────────────────────
-- Biography content is factual, publicly verifiable information only.
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
   'Romance, Classic Literature',
   'Pride and Prejudice, Sense and Sensibility, Emma, Persuasion'),

  ('e1000000-0000-0000-0000-000000000007',
   'George Orwell',
   'George Orwell (1903–1950) was an English novelist, essayist, and critic. His work is characterised by lucid prose, social criticism, opposition to totalitarianism, and outspoken support of democratic socialism.',
   'Fiction, Dystopian, Political Satire',
   '1984, Animal Farm, Homage to Catalonia'),

  ('e1000000-0000-0000-0000-000000000008',
   'Paulo Coelho',
   'Paulo Coelho is a Brazilian lyricist and novelist, best known for The Alchemist. His books have been translated into 80 languages and he has sold over 225 million copies worldwide, making him one of the most widely read authors in history.',
   'Fiction, Philosophical Fiction',
   'The Alchemist, Brida, The Valkyries, Veronika Decides to Die'),

  ('e1000000-0000-0000-0000-000000000009',
   'Stephen King',
   'Stephen King is an American author of horror, supernatural fiction, suspense, crime, science fiction, and fantasy. His books have sold more than 350 million copies and many have been adapted into films, television series, and miniseries.',
   'Horror, Thriller, Supernatural Fiction',
   'The Shining, It, Carrie, Pet Sematary, Misery, The Stand'),

  ('e1000000-0000-0000-0000-000000000010',
   'Khaled Hosseini',
   'Khaled Hosseini is an Afghan-American novelist and physician. His debut novel The Kite Runner was one of the best-selling novels of the 2000s. He serves as a UNHCR Goodwill Ambassador.',
   'Fiction, Literary Fiction',
   'The Kite Runner, A Thousand Splendid Suns, And the Mountains Echoed'),

  ('e1000000-0000-0000-0000-000000000011',
   'Jojo Moyes',
   'Jojo Moyes is a British author and journalist who writes romance and literary fiction. She is one of only two authors to have won the Romantic Novel of the Year award twice from the Romantic Novelists'' Association.',
   'Romance, Literary Fiction',
   'Me Before You, After You, Still Me, The Giver of Stars'),

  ('e1000000-0000-0000-0000-000000000012',
   'John Green',
   'John Green is an American author of young adult fiction, a video blogger, and a podcaster. His novels frequently explore themes of love, coming-of-age, and existential questioning, and have sold tens of millions of copies worldwide.',
   'Young Adult Fiction, Romance',
   'The Fault in Our Stars, Looking for Alaska, Paper Towns, Turtles All the Way Down'),

  ('e1000000-0000-0000-0000-000000000013',
   'Colleen Hoover',
   'Colleen Hoover is an American author known for her new adult romance and young adult fiction novels. She self-published her first novel in 2012 and has since become one of the most popular romance authors, with a massive online following (#BookTok).',
   'Romance, New Adult Fiction',
   'It Ends with Us, Ugly Love, Verity, November 9, Confess'),

  ('e1000000-0000-0000-0000-000000000014',
   'Bram Stoker',
   'Bram Stoker (1847–1912) was an Irish author best known for writing the Gothic horror novel Dracula, published in 1897. He also wrote several other works of horror and adventure.',
   'Gothic Horror, Victorian Fiction',
   'Dracula, The Jewel of Seven Stars, The Lair of the White Worm'),

  ('e1000000-0000-0000-0000-000000000015',
   'Mary Shelley',
   'Mary Shelley (1797–1851) was an English novelist who wrote Frankenstein, widely regarded as the first modern science fiction novel. She was the daughter of philosopher William Godwin and feminist Mary Wollstonecraft.',
   'Gothic Horror, Science Fiction',
   'Frankenstein, The Last Man, Valperga'),

  ('e1000000-0000-0000-0000-000000000016',
   'Shirley Jackson',
   'Shirley Jackson (1916–1965) was an American author known for her work in horror and mystery. Her story The Lottery is one of the most famous short stories in American literature. The Haunting of Hill House is considered one of the finest horror novels ever written.',
   'Horror, Psychological Thriller',
   'The Haunting of Hill House, We Have Always Lived in the Castle, The Lottery'),

  ('e1000000-0000-0000-0000-000000000017',
   'Harper Lee',
   'Harper Lee (1926–2016) was an American novelist best known for To Kill a Mockingbird, which won the Pulitzer Prize in 1961. The novel is widely taught in American schools and deals with themes of racial injustice and moral growth.',
   'Literary Fiction, Social Commentary',
   'To Kill a Mockingbird, Go Set a Watchman'),

  ('e1000000-0000-0000-0000-000000000018',
   'F. Scott Fitzgerald',
   'F. Scott Fitzgerald (1896–1940) was an American novelist, widely regarded as one of the greatest writers of the twentieth century. He is best known for The Great Gatsby, a portrait of the Jazz Age and the American Dream.',
   'Literary Fiction, American Classic',
   'The Great Gatsby, Tender Is the Night, This Side of Paradise')

ON CONFLICT (name) DO NOTHING;

-- ── Link authors to books by matching author name ──────────────────────────────
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
