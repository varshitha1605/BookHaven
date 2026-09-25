import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type { AuthResponse, CartResponse, LoginRequest, RegisterRequest } from '@/types/api';

interface MergeCartRequest {
  items: { bookId: string; quantity: number }[];
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    refresh: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (body) => ({ url: '/auth/refresh', method: 'POST', body }),
    }),
    mergeCart: builder.mutation<CartResponse, MergeCartRequest>({
      query: (body) => ({ url: '/auth/cart/merge', method: 'POST', body }),
    }),
    forgotPassword: builder.mutation<{ message: string; devToken: string; devNote: string }, { email: string }>({
      query: (body) => ({ url: '/auth/password/forgot', method: 'POST', body }),
    }),
    validateResetToken: builder.query<{ valid: boolean }, string>({
      query: (token) => `/auth/password/validate?token=${encodeURIComponent(token)}`,
    }),
    resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: (body) => ({ url: '/auth/password/reset', method: 'POST', body }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useMergeCartMutation,
  useForgotPasswordMutation,
  useValidateResetTokenQuery,
  useResetPasswordMutation,
} = authApi;
