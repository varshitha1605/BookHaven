import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserSummary } from '@/types/api';
import { tokenStorage } from '@/lib/api';

interface AuthState {
  user: UserSummary | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// Rehydrate from localStorage on page load
const storedAccess = tokenStorage.getAccess();
const storedRefresh = tokenStorage.getRefresh();
const storedUser = localStorage.getItem('user');

const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as UserSummary) : null,
  accessToken: storedAccess,
  refreshToken: storedRefresh,
  isAuthenticated: !!storedAccess,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: UserSummary; accessToken: string; refreshToken: string }>,
    ) {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      tokenStorage.set(accessToken, refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      tokenStorage.clear();
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
