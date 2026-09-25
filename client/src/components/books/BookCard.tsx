import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { addGuestItem } from '@/store/cartSlice';
import { toggleWishlist } from '@/store/wishlistSlice';
import { useAddToCartMutation } from '@/store/api/cartApi';
import StarRating from '@/components/common/StarRating';
import { formatINR } from '@/lib/currency';
import type { BookSummary } from '@/types/api';

interface BookCardProps {
  book: BookSummary;
  compact?: boolean;
}

// ── SVG Fallback Cover ────────────────────────────────────────────────────────
// Shown when coverImageUrl is null or fails to load.
// Deterministic palette per book — never a blank white box.

interface CoverPalette { bg: string; bg2: string; spine: string; text: string; accent: string; }

const CATEGORY_PALETTES: Record<string, CoverPalette> = {
  'Fiction':               { bg: '#1C3F6E', bg2: '#1E4D88', spine: '#F59E0B', text: '#EFF6FF', accent: '#FBBF24' },
  'Horror':                { bg: '#1A0A0A', bg2: '#3B0A0A', spine: '#EF4444', text: '#FEF2F2', accent: '#FCA5A5' },
  'Mystery':               { bg: '#1E293B', bg2: '#0F172A', spine: '#94A3B8', text: '#F1F5F9', accent: '#CBD5E1' },
  'Thriller':              { bg: '#1C1C2E', bg2: '#16213E', spine: '#A855F7', text: '#FAF5FF', accent: '#D8B4FE' },
  'Science Fiction':       { bg: '#0C1445', bg2: '#1E3A5F', spine: '#60A5FA', text: '#EFF6FF', accent: '#93C5FD' },
  'Personal Development':  { bg: '#064E3B', bg2: '#065F46', spine: '#34D399', text: '#ECFDF5', accent: '#6EE7B7' },
  'Data & AI':             { bg: '#0C4A6E', bg2: '#075985', spine: '#38BDF8', text: '#F0F9FF', accent: '#7DD3FC' },
  'Software Engineering':  { bg: '#134E4A', bg2: '#0F766E', spine: '#2DD4BF', text: '#F0FDFA', accent: '#5EEAD4' },
  'Programming Languages': { bg: '#1E3A5F', bg2: '#1C3F6E', spine: '#14B8A6', text: '#F0FDFA', accent: '#5EEAD4' },
  'Programming':           { bg: '#1E3A8A', bg2: '#1D4ED8', spine: '#60A5FA', text: '#EFF6FF', accent: '#93C5FD' },
};

const FALLBACK_PALETTES: CoverPalette[] = [
  { bg: '#134E4A', bg2: '#0F766E', spine: '#2DD4BF', text: '#F0FDFA', accent: '#5EEAD4' },
  { bg: '#1C3F6E', bg2: '#1E4D88', spine: '#F59E0B', text: '#EFF6FF', accent: '#FBBF24' },
  { bg: '#1E1B4B', bg2: '#312E81', spine: '#818CF8', text: '#EEF2FF', accent: '#A5B4FC' },
  { bg: '#064E3B', bg2: '#065F46', spine: '#34D399', text: '#ECFDF5', accent: '#6EE7B7' },
  { bg: '#0C4A6E', bg2: '#075985', spine: '#38BDF8', text: '#F0F9FF', accent: '#7DD3FC' },
  { bg: '#1E293B', bg2: '#0F172A', spine: '#94A3B8', text: '#F1F5F9', accent: '#CBD5E1' },
  { bg: '#3B0764', bg2: '#581C87', spine: '#C084FC', text: '#FAF5FF', accent: '#E879F9' },
  { bg: '#450A0A', bg2: '#7F1D1D', spine: '#F87171', text: '#FFF1F2', accent: '#FCA5A5' },
];

function bookHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function FallbackCover({
  title,
  author,
  compact,
  categoryName,
}: {
  title: string;
  author: string;
  compact: boolean;
  categoryName?: string | null;
}) {
  const p = categoryName && CATEGORY_PALETTES[categoryName]
    ? CATEGORY_PALETTES[categoryName]
    : FALLBACK_PALETTES[bookHash(title) % FALLBACK_PALETTES.length];

  const shortTitle = title.length > 28 ? title.slice(0, 26) + '…' : title;
  const shortAuthor = author.split(',')[0].trim();

  const words = shortTitle.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > 14 && cur) { lines.push(cur); cur = w; }
    else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) lines.push(cur);
  const displayLines = lines.slice(0, compact ? 3 : 5);
  const svgH = compact ? 144 : 210;
  const svgW = 120;
  const midY = svgH * 0.48;
  const lineH = compact ? 11 : 14;
  const totalTextH = displayLines.length * lineH;
  const textStartY = midY - totalTextH / 2 + (compact ? 8 : 10);

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className="block w-full h-full"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={`bg-${bookHash(title)}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.bg} />
          <stop offset="100%" stopColor={p.bg2} />
        </linearGradient>
      </defs>
      <rect width={svgW} height={svgH} fill={`url(#bg-${bookHash(title)})`} />

      {/* Spine */}
      <rect x="0" width="7" height={svgH} fill={p.spine} opacity="0.85" />
      <rect x="0" width="1.5" height={svgH} fill="white" opacity="0.15" />

      {/* Top accent line */}
      <line x1="12" y1={svgH * 0.1} x2={svgW - 4} y2={svgH * 0.1} stroke={p.accent} strokeWidth="0.5" opacity="0.5" />
      {/* Bottom accent line */}
      <line x1="12" y1={svgH * 0.88} x2={svgW - 4} y2={svgH * 0.88} stroke={p.accent} strokeWidth="0.5" opacity="0.5" />

      {/* Category label */}
      {!compact && categoryName && (
        <text x={svgW / 2 + 3.5} y={svgH * 0.1 - 3}
          textAnchor="middle" fill={p.accent}
          fontSize="5" fontFamily="Inter,system-ui,sans-serif" fontWeight="600"
          letterSpacing="1.2" opacity="0.75">
          {categoryName.toUpperCase().slice(0, 16)}
        </text>
      )}

      {/* Title */}
      {displayLines.map((line, i) => (
        <text key={i}
          x={svgW / 2 + 3.5}
          y={textStartY + i * lineH}
          textAnchor="middle"
          fill={p.text}
          fontSize={compact ? 7.5 : 9}
          fontFamily="Inter,system-ui,sans-serif"
          fontWeight="800"
        >
          {line}
        </text>
      ))}

      {/* Author */}
      {!compact && (
        <text x={svgW / 2 + 3.5} y={svgH * 0.91}
          textAnchor="middle" fill={p.accent}
          fontSize="5.5" fontFamily="Inter,system-ui,sans-serif" fontWeight="500" opacity="0.9">
          {shortAuthor.length > 18 ? shortAuthor.slice(0, 16) + '…' : shortAuthor}
        </text>
      )}

      {/* Decorative corner circle */}
      <circle cx={svgW - 10} cy={10} r="7" fill={p.spine} opacity="0.12" />
    </svg>
  );
}

// ── BookCard ──────────────────────────────────────────────────────────────────

export default function BookCard({ book, compact = false }: BookCardProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const wishlisted = useAppSelector((s) => s.wishlist.items.some((i) => i.bookId === book.id));
  const [addToCartServer, { isLoading: isAdding }] = useAddToCartMutation();
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (book.stockQuantity === 0 || isAdding) return;
    setCartError(null);

    if (isAuthenticated) {
      try {
        // unwrap() throws on API error — previously missing, causing silent failures
        await addToCartServer({ bookId: book.id, quantity: 1 }).unwrap();
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      } catch (err: unknown) {
        const apiErr = err as { data?: { message?: string }; status?: number };
        if (apiErr?.status === 401) {
          setCartError('Please sign in to add items to your cart.');
        } else if (apiErr?.status === 400) {
          setCartError(apiErr?.data?.message ?? 'Not enough stock available.');
        } else {
          setCartError(apiErr?.data?.message ?? 'Could not add to cart. Please try again.');
        }
        setTimeout(() => setCartError(null), 4000);
      }
    } else {
      dispatch(addGuestItem({
        bookId: book.id,
        title: book.title,
        author: book.author,
        coverImageUrl: book.coverImageUrl,
        price: book.price,
        stockQuantity: book.stockQuantity,
        quantity: 1,
      }));
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  }

  const showRealImage = !!book.coverImageUrl && !imgError;

  return (
    <div className="group flex flex-col bg-white rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden h-full" style={{ border: '1px solid #EDE7DC' }}>

      {/* ── Cover image area ────────────────────────── */}
      <Link
        to={`/books/${book.id}`}
        className="relative block shrink-0 overflow-hidden"
        style={{ aspectRatio: '2/3' }}
        tabIndex={-1}
        aria-hidden="true"
      >
        {showRealImage ? (
          <img
            src={book.coverImageUrl!}
            alt={book.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0">
            <FallbackCover
              title={book.title}
              author={book.author}
              compact={compact}
              categoryName={book.category?.name}
            />
          </div>
        )}

        {/* Wishlist button */}
        {!compact && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
            className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-colors ${
              wishlisted ? 'text-white' : 'bg-white/90 hover:text-red-400'
            }`}
            style={wishlisted ? { backgroundColor: '#C98268' } : { color: '#C4B5A8' }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg className="w-3.5 h-3.5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        )}

        {/* Stock overlay for out-of-stock */}
        {book.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center z-10">
            <span className="bg-white/95 text-stone-700 text-xs font-semibold px-3 py-1 rounded-full shadow">
              Out of stock
            </span>
          </div>
        )}

        {/* Low stock badge */}
        {!compact && book.stockQuantity > 0 && book.stockQuantity <= 5 && (
          <span className="absolute bottom-2 left-2 z-10 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 shadow-sm">
            Only {book.stockQuantity} left
          </span>
        )}
      </Link>

      {/* ── Info ───────────────────────────────────── */}
      <div className="flex flex-col p-3 flex-1 gap-1.5">
        <Link to={`/books/${book.id}`}>
          <h3 className={`font-semibold leading-snug line-clamp-2 transition-colors ${compact ? 'text-xs' : 'text-sm'}`} style={{ color: '#293B32' }}>
            {book.title}
          </h3>
        </Link>

        {!compact && (
          <p className="text-xs truncate" style={{ color: '#68736B' }}>{book.author}</p>
        )}

        {!compact && book.averageRating > 0 && (
          <StarRating rating={book.averageRating} reviewCount={book.reviewCount} />
        )}

        {/* Price + category */}
        <div className="mt-auto pt-1.5 flex items-center justify-between gap-1">
          <span className={`font-bold ${compact ? 'text-xs' : 'text-sm'}`} style={{ color: '#0F5132' }}>
            {formatINR(book.price)}
          </span>
          {!compact && book.category && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium truncate max-w-[80px]" style={{ backgroundColor: '#F5E4DC', color: '#C98268' }}>
              {book.category.name.split(' ')[0]}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        {!compact && (
          <div className="mt-1 space-y-1">
            <button
              onClick={handleAddToCart}
              disabled={book.stockQuantity === 0 || isAdding}
              className={`w-full py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                book.stockQuantity === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'text-white shadow-sm'
              }`}
              style={book.stockQuantity > 0 ? {
                backgroundColor: added ? '#0A3D26' : isAdding ? '#1A6B44' : '#0F5132',
                opacity: isAdding ? 0.85 : 1,
                cursor: isAdding ? 'wait' : undefined,
              } : {}}
              aria-label={`Add ${book.title} to cart`}
            >
              {isAdding ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Adding…
                </>
              ) : added ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Added to Cart
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>

            {/* Error message under button */}
            {cartError && (
              <p className="text-[10px] text-red-600 text-center leading-tight px-1">{cartError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
