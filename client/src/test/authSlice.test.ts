import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, { setCredentials, logout } from '@/store/authSlice';
import type { UserSummary } from '@/types/api';

const mockUser: UserSummary = {
  id: 'user-1',
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  role: 'USER',
};

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initial state has no user or tokens', () => {
    // Reset by creating reducer with fresh state
    const state = authReducer(
      { user: null, accessToken: null, refreshToken: null, isAuthenticated: false },
      { type: '@@INIT' },
    );
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('setCredentials stores user and marks authenticated', () => {
    const state = authReducer(initialState, setCredentials({
      user: mockUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }));
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('jane@example.com');
    expect(state.accessToken).toBe('access-token');
    expect(localStorage.getItem('accessToken')).toBe('access-token');
  });

  it('logout clears all state and localStorage', () => {
    const loggedIn = authReducer(initialState, setCredentials({
      user: mockUser,
      accessToken: 'tok',
      refreshToken: 'ref',
    }));
    const loggedOut = authReducer(loggedIn, logout());
    expect(loggedOut.isAuthenticated).toBe(false);
    expect(loggedOut.user).toBeNull();
    expect(loggedOut.accessToken).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});
