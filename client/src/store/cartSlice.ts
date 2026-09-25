import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Guest cart persisted in localStorage — merged on login
interface GuestCartState {
  items: GuestCartItem[];
}

export interface GuestCartItem {
  bookId: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  price: number;
  stockQuantity: number;
  quantity: number;
}

const STORAGE_KEY = 'guestCart';

function load(): GuestCartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GuestCartState) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function save(state: GuestCartState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const cartSlice = createSlice({
  name: 'guestCart',
  initialState: load(),
  reducers: {
    addGuestItem(state, action: PayloadAction<GuestCartItem>) {
      const existing = state.items.find((i) => i.bookId === action.payload.bookId);
      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + action.payload.quantity,
          action.payload.stockQuantity,
        );
      } else {
        state.items.push(action.payload);
      }
      save(state);
    },
    updateGuestItem(state, action: PayloadAction<{ bookId: string; quantity: number }>) {
      const item = state.items.find((i) => i.bookId === action.payload.bookId);
      if (item) {
        item.quantity = action.payload.quantity;
        save(state);
      }
    },
    removeGuestItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.bookId !== action.payload);
      save(state);
    },
    clearGuestCart(state) {
      state.items = [];
      save(state);
    },
  },
});

export const { addGuestItem, updateGuestItem, removeGuestItem, clearGuestCart } =
  cartSlice.actions;
export default cartSlice.reducer;
