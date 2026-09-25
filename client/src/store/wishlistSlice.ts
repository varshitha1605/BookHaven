import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Wishlist persisted in localStorage — works for both guest and authenticated users

export interface WishlistItem {
  bookId: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  price: number;
  stockQuantity: number;
  averageRating: number;
  reviewCount: number;
  categoryName?: string | null;
}

interface WishlistState {
  items: WishlistItem[];
}

const STORAGE_KEY = 'bookhavenWishlist';

function load(): WishlistState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishlistState) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function save(state: WishlistState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: load(),
  reducers: {
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const idx = state.items.findIndex((i) => i.bookId === action.payload.bookId);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
      save(state);
    },
    removeWishlistItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.bookId !== action.payload);
      save(state);
    },
    clearWishlist(state) {
      state.items = [];
      save(state);
    },
  },
});

export const { toggleWishlist, removeWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
