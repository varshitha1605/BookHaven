import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import { authApi } from './api/authApi';
import { booksApi } from './api/booksApi';
import { cartApi } from './api/cartApi';
import { ordersApi } from './api/ordersApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    guestCart: cartReducer,
    wishlist: wishlistReducer,
    [authApi.reducerPath]: authApi.reducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault()
      .concat(authApi.middleware)
      .concat(booksApi.middleware)
      .concat(cartApi.middleware)
      .concat(ordersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
