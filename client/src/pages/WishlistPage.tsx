import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { removeWishlistItem, clearWishlist } from '@/store/wishlistSlice';
import { addGuestItem } from '@/store/cartSlice';
import { useAddToCartMutation } from '@/store/api/cartApi';
import AuthPageShell from '@/components/layout/AuthPageShell';
import { formatINR } from '@/lib/currency';
import { useState } from 'react';

// ── SVG Fallback Cover (minimal version for wishlist) ─────────────────────────
const CATEGORY_BG: Record<string, string> = {
  'Fiction':               '#1C3F6E',
  'Horror':                '#1A0A0A',
  'Mystery':               '#1E293B',
  'Thriller':              '#1C1C2E',
  'Science Fiction':       '#0C1445',
  'Personal Development':  '#064E3B',
  'Data & AI':             '#0C4A6E',
  'Software Engineering':  '#134E4A',
  'Programming Languages': '#1E3A5F',
  'Programming':           '#1E3A8A',
};

function bookHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const FALLBACK_BG = ['#134E4A', '#1C3F6E', '#1E1B4B', '#064E3B', '#0C4A6E', '#1E293B'];

function SmallCover({ title, categoryName }: { title: string; categoryName?: string | null }) {
  const bg = (categoryName && CATEGORY_BG[categoryName]) ?? FALLBACK_BG[bookHash(title) % FALLBACK_BG.length];
  const words = title.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > 10 && cur) { lines.push(cur); cur = w; }
    else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) lines.push(cur);
  const displayLines = lines.slice(0, 4);

  return (
    <svg viewBox="0 0 80 120" width="80" height="120" xmlns="http://www.w3.org/2000/svg" className="shrink-0 rounded-md shadow-sm">
      <defs>
        <linearGradient id={`wbg-${bookHash(title)}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bg} />
          <stop offset="100%" stopColor={bg + 'BB'} />
        </linearGradient>
      </defs>
      <rect width="80" height="120" fill={`url(#wbg-${bookHash(title)})`} rx="3" />
      <rect x="0" width="5" height="120" fill="rgba(255,255,255,0.18)" rx="2" />
      {displayLines.map((line, i) => (
        <text key={i} x="42" y={50 + i * 12} textAnchor="middle" fill="white"
          fontSize="7" fontFamily="Inter,system-ui,sans-serif" fontWeight="700">
          {line}
        </text>
      ))}
    </svg>
  );
}

// ── WishlistItem card ─────────────────────────────────────────────────────────
function WishlistCard({ item }: { item: ReturnType<typeof useAppSelector<import('@/store').RootState['wishlist']['items'][number]>> }) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const [addToCartServer, { isLoading: isAdding }] = useAddToCartMutation();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  async function handleAddToCart() {
    if (item.stockQuantity === 0 || isAdding) return;
    if (isAuthenticated) {
      try {
        await addToCartServer({ bookId: item.bookId, quantity: 1 }).unwrap();
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      } catch { /* ignore */ }
    } else {
      dispatch(addGuestItem({
        bookId: item.bookId,
        title: item.title,
        author: item.author,
        coverImageUrl: item.coverImageUrl,
        price: item.price,
        stockQuantity: item.stockQuantity,
        quantity: 1,
      }));
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  }

  const showImage = !!item.coverImageUrl && !imgError;

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-card hover:shadow-card-hover transition-all duration-200 flex items-center gap-4 p-4">
      {/* Cover */}
      <Link to={`/books/${item.bookId}`} className="shrink-0">
        {showImage ? (
          <img
            src={item.coverImageUrl!}
            alt={item.title}
            loading="lazy"
            className="w-[60px] h-[90px] object-cover rounded-md shadow-sm"
            onError={() => setImgError(true)}
          />
        ) : (
          <SmallCover title={item.title} categoryName={item.categoryName} />
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link to={`/books/${item.bookId}`}>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-green-800 transition-colors" style={{ color: '#1F2937' }}>
            {item.title}
          </h3>
        </Link>
        <p className="text-xs mt-0.5 truncate" style={{ color: '#6B7280' }}>{item.author}</p>
        {item.categoryName && (
          <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: '#F0F7F4', color: '#0F5132' }}>
            {item.categoryName.split(' ')[0]}
          </span>
        )}
        {item.averageRating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[10px] font-medium text-stone-600">{item.averageRating.toFixed(1)}</span>
            <span className="text-[10px] text-stone-400">({item.reviewCount})</span>
          </div>
        )}
      </div>

      {/* Price + actions */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="font-bold text-sm" style={{ color: '#0F5132' }}>{formatINR(item.price)}</span>

        {item.stockQuantity === 0 ? (
          <span className="text-[10px] font-medium text-red-500">Out of stock</span>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-white"
            style={{ backgroundColor: added ? '#166534' : isAdding ? '#1E7A55' : '#0F5132', opacity: isAdding ? 0.85 : 1 }}
          >
            {isAdding ? 'Adding…' : added ? '✓ Added' : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        )}

        <button
          onClick={() => dispatch(removeWishlistItem(item.bookId))}
          className="text-[10px] text-stone-400 hover:text-red-500 transition-colors flex items-center gap-0.5"
          aria-label="Remove from wishlist"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
}

// ── WishlistPage ──────────────────────────────────────────────────────────────
export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.wishlist.items);

  if (items.length === 0) {
    return (
      <AuthPageShell>
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0F7F4' }}>
          <svg className="w-10 h-10" style={{ color: '#C9A96A' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#1F2937' }}>Your wishlist is empty</h1>
        <p className="text-sm mb-8" style={{ color: '#6B7280' }}>
          Save books you love by clicking the ♥ heart on any book card.
        </p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
          style={{ backgroundColor: '#0F5132' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          Browse Books
        </Link>
      </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell>
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#1F2937' }}>My Wishlist</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
            {items.length} {items.length === 1 ? 'book' : 'books'} saved
          </p>
        </div>
        <button
          onClick={() => dispatch(clearWishlist())}
          className="text-xs hover:text-red-500 transition-colors border hover:border-red-200 rounded-lg px-3 py-1.5 font-medium"
          style={{ color: '#9CA3AF', borderColor: '#E5E7EB' }}
        >
          Clear all
        </button>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <WishlistCard key={item.bookId} item={item} />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
        <Link to="/browse" className="text-sm font-medium hover:underline transition-colors" style={{ color: '#0F5132' }}>
          ← Continue browsing
        </Link>
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-white font-semibold px-5 py-2 rounded-xl transition-colors text-sm shadow-sm"
          style={{ backgroundColor: '#0F5132' }}
        >
          Go to Cart
        </Link>
      </div>
    </div>
    </AuthPageShell>
  );
}
