import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetBookQuery } from '@/store/api/booksApi';
import { formatINR } from '@/lib/currency';
import { useAddToCartMutation } from '@/store/api/cartApi';
import { useAppSelector, useAppDispatch } from '@/store';
import { addGuestItem } from '@/store/cartSlice';
import { toggleWishlist } from '@/store/wishlistSlice';
import Spinner from '@/components/common/Spinner';
import StarRating from '@/components/common/StarRating';
import Button from '@/components/common/Button';
import BookCard from '@/components/books/BookCard';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { ApiError } from '@/types/api';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading } = useGetBookQuery(id!);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const [addToCart, { isLoading: isAdding, error: cartError }] = useAddToCartMutation();
  const wishlisted = useAppSelector((s) => s.wishlist.items.some((i) => i.bookId === id));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!book) return <p className="text-center py-20" style={{ color: '#68736B' }}>Book not found.</p>;

  async function handleAddToCart() {
    if (!book) return;
    if (isAuthenticated) {
      try {
        await addToCart({ bookId: book.id, quantity: qty }).unwrap();
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } catch { /* shown via cartError */ }
    } else {
      dispatch(addGuestItem({
        bookId: book.id,
        title: book.title,
        author: book.author,
        coverImageUrl: book.coverImageUrl,
        price: book.price,
        stockQuantity: book.stockQuantity,
        quantity: qty,
      }));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  const cartErrorMsg = cartError
    ? ((cartError as { data: ApiError }).data?.message ?? 'Could not add to cart')
    : undefined;

  const showRealImage = !!book.coverImageUrl && !imgError;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6 flex flex-wrap items-center gap-1" style={{ color: '#68736B' }}>
        <Link to="/" className="hover:underline transition-colors hover:text-[#0F5132]" style={{ color: '#68736B' }}>Home</Link>
        <span className="mx-1">/</span>
        <Link to="/browse" className="hover:underline transition-colors hover:text-[#0F5132]" style={{ color: '#68736B' }}>Browse</Link>
        {book.category && (
          <>
            <span className="mx-1">/</span>
            <Link to={`/browse?categoryId=${book.category.id}`} className="hover:underline transition-colors hover:text-[#0F5132]" style={{ color: '#68736B' }}>
              {book.category.name}
            </Link>
          </>
        )}
        <span className="mx-1">/</span>
        <span className="line-clamp-1" style={{ color: '#293B32' }}>{book.title}</span>
      </nav>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {/* ── Cover ──────────────────────────────────────────────── */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="rounded-2xl overflow-hidden shadow-card aspect-[2/3] flex items-center justify-center" style={{ border: '1px solid #EDE7DC', backgroundColor: '#F6F8F5' }}>
              {showRealImage ? (
                <img
                  src={book.coverImageUrl!}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                /* Styled fallback */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white" style={{ backgroundColor: '#2F3A31' }}>
                  <svg className="w-12 h-12 opacity-30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.012 3C4.349 3 3 4.343 3 6v12c0 1.657 1.349 3 3.012 3H18a2 2 0 002-2V5a2 2 0 00-2-2H6.012zM5 6a1 1 0 011.012-1H10v8.5l-2.5-1.75L5 14.5V6zm2.5 10.25L10 14.5l2.5 1.75V5H18v14H6.012A1.01 1.01 0 015 18v-1.75z"/>
                  </svg>
                  <p className="text-sm font-bold leading-snug opacity-80">{book.title}</p>
                  <p className="text-xs opacity-50 mt-1">{book.author}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Details ──────────────────────────────────────────── */}
        <div className="md:col-span-2 space-y-5">
          {/* Category badge */}
          {book.category && (
            <Link to={`/browse?categoryId=${book.category.id}`}>
              <span className="badge text-xs font-semibold px-2.5 py-1 rounded-full transition-colors" style={{ backgroundColor: '#EBF0E9', color: '#0F5132' }}>
                {book.category.name}
              </span>
            </Link>
          )}

          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight" style={{ color: '#293B32', fontFamily: 'Georgia, "Times New Roman", serif' }}>{book.title}</h1>

          {/* Author link */}
          {book.authorDetail ? (
            <Link to={`/authors/${book.authorDetail.id}`} className="group flex items-center gap-2 w-fit">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white transition-colors" style={{ backgroundColor: '#0F5132' }}>
                {book.author.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <span className="font-medium transition-colors group-hover:underline" style={{ color: '#293B32' }}>{book.author}</span>
              <svg className="w-3.5 h-3.5 transition-colors" style={{ color: '#A8B5A0' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <p className="font-medium" style={{ color: '#293B32' }}>{book.author}</p>
          )}

          <StarRating rating={book.averageRating} reviewCount={book.reviewCount} size="md" />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold" style={{ color: '#0F5132' }}>{formatINR(book.price)}</span>
          </div>

          {/* Stock */}
          {book.stockQuantity > 0 ? (
            <p className="text-sm font-medium flex items-center gap-1.5" style={{ color: '#5A7A5E' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              In stock — {book.stockQuantity} available
            </p>
          ) : (
            <p className="text-sm font-medium" style={{ color: '#C98268' }}>Currently out of stock</p>
          )}

          {/* Add to Cart */}
          {book.stockQuantity > 0 && (
            <div className="flex items-center gap-3 pt-1">
              <select
                className="rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-all"
                style={{ border: '1px solid #E8E2D8', color: '#293B32', '--tw-ring-color': '#0F5132' } as React.CSSProperties}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              >
                {Array.from({ length: Math.min(book.stockQuantity, 10) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <Button
                onClick={handleAddToCart}
                loading={isAdding}
                size="lg"
                className={`flex-1 sm:flex-none ${added ? '!bg-[#0A3D26]' : ''}`}
              >
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </Button>

              {/* Wishlist toggle */}
              <button
                onClick={() => {
                  if (!book) return;
                  dispatch(toggleWishlist({
                    bookId: book.id,
                    title: book.title,
                    author: book.author,
                    coverImageUrl: book.coverImageUrl,
                    price: book.price,
                    stockQuantity: book.stockQuantity,
                    averageRating: book.averageRating,
                    reviewCount: book.reviewCount,
                    categoryName: book.category?.name,
                  }));
                }}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98268] focus-visible:ring-offset-1"
                style={wishlisted
                  ? { backgroundColor: '#FDF0EC', borderColor: '#C98268', color: '#C98268' }
                  : { backgroundColor: '#FFFFFF', borderColor: '#E8E2D8', color: '#68736B' }
                }
                onMouseEnter={e => {
                  if (!wishlisted) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#C98268';
                    (e.currentTarget as HTMLButtonElement).style.color = '#C98268';
                  }
                }}
                onMouseLeave={e => {
                  if (!wishlisted) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#E8E2D8';
                    (e.currentTarget as HTMLButtonElement).style.color = '#68736B';
                  }
                }}
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  fill={wishlisted ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <span className="hidden sm:inline whitespace-nowrap">
                  {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </span>
              </button>
            </div>
          )}

          <ErrorMessage message={cartErrorMsg} />

          {/* Metadata table */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm rounded-xl p-4" style={{ backgroundColor: '#F6F8F5', border: '1px solid #EDE7DC' }}>
            {book.isbn && (
              <><dt className="font-medium" style={{ color: '#68736B' }}>ISBN</dt><dd style={{ color: '#293B32' }}>{book.isbn}</dd></>
            )}
            {book.publisher && (
              <><dt className="font-medium" style={{ color: '#68736B' }}>Publisher</dt><dd style={{ color: '#293B32' }}>{book.publisher.name}</dd></>
            )}
            {book.category && (
              <><dt className="font-medium" style={{ color: '#68736B' }}>Category</dt>
              <dd><Link to={`/browse?categoryId=${book.category.id}`} className="hover:underline" style={{ color: '#0F5132' }}>{book.category.name}</Link></dd></>
            )}
            {book.pageCount && (
              <><dt className="font-medium" style={{ color: '#68736B' }}>Pages</dt><dd style={{ color: '#293B32' }}>{book.pageCount}</dd></>
            )}
            {book.language && (
              <><dt className="font-medium" style={{ color: '#68736B' }}>Language</dt><dd style={{ color: '#293B32' }}>{book.language}</dd></>
            )}
            {book.publishedDate && (
              <><dt className="font-medium" style={{ color: '#68736B' }}>Published</dt>
              <dd style={{ color: '#293B32' }}>{new Date(book.publishedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</dd></>
            )}
          </dl>

          {/* Description */}
          {book.description && (
            <div style={{ borderTop: '1px solid #EDE7DC' }} className="pt-4">
              <h2 className="font-bold mb-2 text-sm uppercase tracking-wide" style={{ color: '#A8B5A0' }}>About this book</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#68736B' }}>{book.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── About the Author ──────────────────────────────────────── */}
      {book.authorDetail && (
        <section className="mt-10 bg-white rounded-2xl p-6 shadow-card" style={{ border: '1px solid #EDE7DC' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#293B32', fontFamily: 'Georgia, "Times New Roman", serif' }}>About the Author</h2>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-extrabold shrink-0 text-white" style={{ backgroundColor: '#0F5132' }}>
              {book.author.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <Link to={`/authors/${book.authorDetail.id}`} className="font-bold transition-colors hover:underline" style={{ color: '#293B32' }}>
                {book.authorDetail.name}
              </Link>
              {book.authorDetail.genre && (
                <p className="text-xs mt-0.5" style={{ color: '#6B8F71' }}>{book.authorDetail.genre}</p>
              )}
              {book.authorDetail.bio && (
                <p className="text-sm mt-2 leading-relaxed line-clamp-4" style={{ color: '#68736B' }}>{book.authorDetail.bio}</p>
              )}
              {book.authorDetail.famousWorks && (
                <p className="text-xs mt-2" style={{ color: '#A8B5A0' }}>
                  <span className="font-medium" style={{ color: '#68736B' }}>Also known for: </span>
                  {book.authorDetail.famousWorks}
                </p>
              )}
              <Link
                to={`/authors/${book.authorDetail.id}`}
                className="inline-flex items-center gap-1 text-xs hover:underline mt-3"
                style={{ color: '#0F5132' }}
              >
                View author profile →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Related books ─────────────────────────────────────────── */}
      {book.relatedBooks.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#293B32', fontFamily: 'Georgia, "Times New Roman", serif' }}>You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {book.relatedBooks.map((b) => <BookCard key={b.id} book={b} compact />)}
          </div>
        </section>
      )}
    </div>
  );
}
