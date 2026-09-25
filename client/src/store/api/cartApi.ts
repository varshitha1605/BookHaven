import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type { AddressRequest, AddressResponse, CartResponse } from '@/types/api';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Cart', 'Address'],
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<CartResponse, { bookId: string; quantity: number }>({
      query: (body) => ({ url: '/cart', method: 'POST', body }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<CartResponse, { itemId: string; quantity: number }>({
      query: ({ itemId, quantity }) => ({
        url: `/cart/items/${itemId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation<CartResponse, string>({
      query: (itemId) => ({ url: `/cart/items/${itemId}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<void, void>({
      query: () => ({ url: '/cart', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),

    // ── Addresses ─────────────────────────────────────────────────────────────
    listAddresses: builder.query<AddressResponse[], void>({
      query: () => '/addresses',
      providesTags: ['Address'],
    }),
    addAddress: builder.mutation<AddressResponse, AddressRequest>({
      query: (body) => ({ url: '/addresses', method: 'POST', body }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: builder.mutation<AddressResponse, { id: string } & AddressRequest>({
      query: ({ id, ...body }) => ({ url: `/addresses/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: builder.mutation<void, string>({
      query: (id) => ({ url: `/addresses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useListAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = cartApi;
