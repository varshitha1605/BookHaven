/**
 * Shared RTK Query base query with automatic token refresh (re-auth).
 *
 * When any API call returns 401:
 *  1. Attempt a silent token refresh via POST /auth/refresh
 *  2. If refresh succeeds → update Redux state + localStorage → retry the original request
 *  3. If refresh fails → dispatch logout (clears tokens) → the app will show the login page
 *
 * This ensures cart, order, address, and auth calls all benefit from the same
 * refresh logic without duplicating it.
 */
import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import { setCredentials, logout } from '@/store/authSlice';
import { tokenStorage } from '@/lib/api';
import type { AuthResponse } from '@/types/api';

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // If 401, attempt silent token refresh once
  if (result.error && result.error.status === 401) {
    const refreshToken = tokenStorage.getRefresh();

    if (refreshToken) {
      // Try to get a new access token
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const refreshed = refreshResult.data as AuthResponse;
        // Save new tokens to Redux + localStorage
        api.dispatch(
          setCredentials({
            user: refreshed.user,
            accessToken: refreshed.accessToken,
            refreshToken: refreshed.refreshToken,
          }),
        );
        // Retry the original request with the new token
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Refresh failed — clear session
        api.dispatch(logout());
      }
    } else {
      // No refresh token stored — clear session
      api.dispatch(logout());
    }
  }

  return result;
};
