import { Link } from 'react-router-dom';
import { useListAuthorsQuery } from '@/store/api/booksApi';
import Spinner from '@/components/common/Spinner';

// Warm avatar palette — deterministic by name hash
const AVATAR_COLORS = [
  '#0F5132', '#C98268', '#C9A96A', '#6B8F71',
  '#1A6B44', '#5D7258', '#D29278', '#A8883E',
];

function nameHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function AuthorsPage() {
  const { data: authors, isLoading, isError, error } = useListAuthorsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="rounded-2xl p-8 inline-block" style={{ backgroundColor: '#FBF4F1', border: '1px solid #EAC5B4' }}>
          <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: '#C98268' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="font-semibold mb-1" style={{ color: '#3B2409' }}>Could not load authors</p>
          <p className="text-xs" style={{ color: '#C98268' }}>
            {(error as { data?: { message?: string } })?.data?.message ?? 'Please check the API connection and try again.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#EBF0E9', color: '#0F5132' }}>
            {authors?.length ?? 0} Authors
          </span>
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: '#293B32', fontFamily: 'Georgia, "Times New Roman", serif' }}>Meet the Authors</h1>
        <p className="mt-1.5 max-w-xl text-sm" style={{ color: '#68736B' }}>
          Discover the brilliant writers behind your favourite books — their stories, genres, and celebrated works.
        </p>
      </div>

      {/* Empty state */}
      {(!authors || authors.length === 0) && (
        <div className="bg-white rounded-2xl py-20 text-center" style={{ border: '1px solid #EDE7DC' }}>
          <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: '#A8B5A0' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <p className="font-semibold mb-1" style={{ color: '#293B32' }}>No author profiles available yet</p>
          <p className="text-xs" style={{ color: '#68736B' }}>
            Diagnostic: Verify that the backend is running and <code className="rounded px-1" style={{ backgroundColor: '#F6F8F5' }}>/api/authors</code> returns data.
          </p>
        </div>
      )}

      {/* Author grid */}
      {authors && authors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {authors.map((author) => {
            const avatarBg = AVATAR_COLORS[nameHash(author.name) % AVATAR_COLORS.length];
            const initials = getInitials(author.name);
            const genreList = author.genre
              ? author.genre.split(',').map((g) => g.trim()).filter(Boolean).slice(0, 3)
              : [];
            const famousWorksList = author.famousWorks
              ? author.famousWorks.split(',').map((w) => w.trim()).filter(Boolean).slice(0, 2)
              : [];

            return (
              <div
                key={author.id}
                className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
                style={{ border: '1px solid #EDE7DC' }}
              >
                {/* Card accent bar */}
                <div className="h-1.5 w-full" style={{ backgroundColor: avatarBg }} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Avatar + name row */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold shrink-0 select-none shadow-sm text-white"
                      style={{ backgroundColor: avatarBg }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h2 className="font-bold text-base leading-tight truncate transition-colors" style={{ color: '#293B32' }}>
                        {author.name}
                      </h2>
                      {/* Genres */}
                      {genreList.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {genreList.map((g) => (
                            <span key={g} className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: '#EBF0E9', color: '#0F5132' }}>
                              {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Biography snippet */}
                  {author.bio && (
                    <p className="text-sm leading-relaxed line-clamp-3 mb-4 flex-1" style={{ color: '#68736B' }}>
                      {author.bio}
                    </p>
                  )}
                  {!author.bio && <div className="flex-1" />}

                  {/* Famous works */}
                  {famousWorksList.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[11px] font-bold uppercase tracking-wide mb-1.5" style={{ color: '#A8B5A0' }}>Notable Works</p>
                      <div className="flex flex-wrap gap-1.5">
                        {famousWorksList.map((work) => (
                          <span key={work} className="text-xs rounded-lg px-2.5 py-1 font-medium" style={{ backgroundColor: '#FBF6EC', color: '#A8883E', border: '1px solid #F5E9CE' }}>
                            {work}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer row: book count + View Profile */}
                  <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid #EDE7DC' }}>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#68736B' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: '#A8B5A0' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                      <span className="font-medium" style={{ color: '#293B32' }}>{author.bookCount}</span>
                      <span>{author.bookCount === 1 ? 'book' : 'books'} in catalogue</span>
                    </div>
                    <Link
                      to={`/authors/${author.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:underline"
                      style={{ color: '#0F5132' }}
                    >
                      View Profile
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
