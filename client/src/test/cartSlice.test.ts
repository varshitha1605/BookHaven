import { describe, it, expect, beforeEach } from 'vitest';
import cartReducer, {
  addGuestItem,
  updateGuestItem,
  removeGuestItem,
  clearGuestCart,
  type GuestCartItem,
} from '@/store/cartSlice';

const makeItem = (overrides: Partial<GuestCartItem> = {}): GuestCartItem => ({
  bookId: 'book-1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  coverImageUrl: null,
  price: 44.99,
  stockQuantity: 10,
  quantity: 1,
  ...overrides,
});

const empty = { items: [] };

describe('cartSlice (guest cart)', () => {
  beforeEach(() => localStorage.clear());

  it('adds a new item', () => {
    const state = cartReducer(empty, addGuestItem(makeItem()));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].bookId).toBe('book-1');
  });

  it('sums quantity for existing item', () => {
    let state = cartReducer(empty, addGuestItem(makeItem({ quantity: 3 })));
    state = cartReducer(state, addGuestItem(makeItem({ quantity: 4 })));
    expect(state.items[0].quantity).toBe(7);
  });

  it('caps quantity at stockQuantity', () => {
    let state = cartReducer(empty, addGuestItem(makeItem({ quantity: 8, stockQuantity: 10 })));
    state = cartReducer(state, addGuestItem(makeItem({ quantity: 5, stockQuantity: 10 })));
    expect(state.items[0].quantity).toBe(10); // capped at 10
  });

  it('updates quantity of existing item', () => {
    let state = cartReducer(empty, addGuestItem(makeItem()));
    state = cartReducer(state, updateGuestItem({ bookId: 'book-1', quantity: 5 }));
    expect(state.items[0].quantity).toBe(5);
  });

  it('removes an item by bookId', () => {
    let state = cartReducer(empty, addGuestItem(makeItem()));
    state = cartReducer(state, removeGuestItem('book-1'));
    expect(state.items).toHaveLength(0);
  });

  it('clearGuestCart empties all items', () => {
    let state = cartReducer(empty, addGuestItem(makeItem()));
    state = cartReducer(state, addGuestItem(makeItem({ bookId: 'book-2', title: 'Refactoring' })));
    state = cartReducer(state, clearGuestCart());
    expect(state.items).toHaveLength(0);
  });

  it('persists cart to localStorage', () => {
    cartReducer(empty, addGuestItem(makeItem()));
    const stored = localStorage.getItem('guestCart');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.items[0].bookId).toBe('book-1');
  });
});
