import { useParams, Link } from 'react-router-dom';
import { useGetAuthorQuery, useGetAuthorBooksQuery } from '@/store/api/booksApi';
import BookCard from '@/components/books/BookCard';
import Spinner from '@/components/common/Spinner';

// Warm avatar palette matching the sage/terracotta/gold brand
const AVATAR_COLORS = [
  '#0F5132', '#6B8F71', '#C98268', '#C9A96A',
  '#1A6B44', '#5D7258', '#D29278', '#A8883E',
];

function nameHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const { data: author, isLoading: authorLoading, isError } = useGetAuthorQuery(id!);
  const { data: books, isLoading: booksLoading } = useGetAuthorBooksQuery(id!);

  if (authorLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (isError || !author) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="bg-white rounded-2xl p-10 inline-block shadow-card" style={{ border: '1px solid #EDE7DC' }}>
          <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: '#A8B5A0' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <p className="font-semibold mb-2" style={{ color: '#293B32' }}>Author not found</p>
          <p className="text-sm mb-4" style={{ color: '#68736B' }}>This author profile does not exist or has been removed.</p>
          <Link
            to="/authors"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
            style={{ color: '#0F5132' }}
          >
            ← Back to Authors
          </Link>
        </div>
      </div>
    );
  }

  const avatarBg = AVATAR_COLORS[nameHash(author.name) % AVATAR_COLORS.length];
  const initials = author.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const famousWorksList = author.famousWorks
    ? author.famousWorks.split(',').map((w) => w.trim()).filter(Boolean)
    : [];
  const genreList = author.genre
    ? author.genre.split(',').map((g) => g.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm" style={{ color: '#68736B' }}>
        <Link to="/" className="transition-colors hover:text-[#0F5132]" style={{ color: '#68736B' }}>Home</Link>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <Link to="/authors" className="transition-colors hover:text-[#0F5132]" style={{ color: '#68736B' }}>Authors</Link>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium truncate max-w-[200px]" style={{ color: '#293B32' }}>{author.name}</span>
      </nav>

      {/* Author hero card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-card" style={{ border: '1px solid #EDE7DC' }}>
        {/* Coloured header band */}
        <div className="h-20 w-full relative" style={{ backgroundColor: avatarBg }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>

        {/* Content area */}
        <div className="px-6 sm:px-8 pb-8 -mt-8">
          {/* Avatar — overlaps header band */}
          <div
            className="w-20 h-20 rounded-2xl border-4 border-white flex items-center justify-center text-3xl font-extrabold select-none shadow-md mb-4 text-white"
            style={{ backgroundColor: avatarBg }}
          >
            {initials}
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight" style={{ color: '#293B32', fontFamily: 'Georgia, "Times New Roman", serif' }}>
                {author.name}
              </h1>
              {genreList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {genreList.map((g) => (
                    <span key={g} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#EBF0E9', color: '#0F5132', border: '1px solid #D6EDE3' }}>
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {author.bookCount > 0 && (
              <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm" style={{ backgroundColor: '#F6F8F5', border: '1px solid #EDE7DC' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: '#A8B5A0' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <span className="font-bold" style={{ color: '#293B32' }}>{author.bookCount}</span>
                <span style={{ color: '#68736B' }}>{author.bookCount === 1 ? 'book' : 'books'} in catalogue</span>
              </div>
            )}
          </div>

          {/* Biography */}
          {author.bio ? (
            <div className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#A8B5A0' }}>Biography</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#293B32' }}>{author.bio}</p>
              <p className="text-xs mt-2 italic" style={{ color: '#A8B5A0' }}>
                Biographical information is factual and publicly verifiable. This is a demo application for learning purposes.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-xl p-4 text-sm italic" style={{ backgroundColor: '#F6F8F5', border: '1px solid #EDE7DC', color: '#68736B' }}>
              No biography available for this author yet.
            </div>
          )}

          {/* Famous works */}
          {famousWorksList.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#A8B5A0' }}>Well-Known Works</h2>
              <div className="flex flex-wrap gap-2">
                {famousWorksList.map((work) => (
                  <span
                    key={work}
                    className="text-sm rounded-xl px-3 py-1.5 font-medium"
                    style={{ backgroundColor: '#FBF6EC', color: '#A8883E', border: '1px solid #F5E9CE' }}
                  >
                    📖 {work}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Books by this author */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold" style={{ color: '#293B32', fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Books by {author.name} in BookHaven
          </h2>
        </div>

        {booksLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !books || books.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl" style={{ border: '1px solid #EDE7DC' }}>
            <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: '#A8B5A0' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <p className="text-sm" style={{ color: '#68736B' }}>No books by this author are currently in our catalogue.</p>
            <Link to="/browse" className="inline-flex items-center gap-1 text-xs font-semibold hover:underline mt-3" style={{ color: '#0F5132' }}>
              Browse all books →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
