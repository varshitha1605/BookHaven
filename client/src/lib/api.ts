import type { ApiError } from '@/types/api';

// In development Vite proxies /api → localhost:8080 (see vite.config.ts).
// In production, set VITE_API_URL to the deployed backend origin (e.g. https://api.example.com).
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

// ─── Token storage ────────────────────────────────────────────────────────────
export const tokenStorage = {
  getAccess: (): string | null => localStorage.getItem('accessToken'),
  getRefresh: (): string | null => localStorage.getItem('refreshToken'),
  set: (access: string, refresh: string): void => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  },
  clear: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = tokenStorage.getAccess();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Token expired — attempt silent refresh once
  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return apiFetch<T>(path, options, false);
    tokenStorage.clear();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({
      timestamp: new Date().toISOString(),
      status: res.status,
      error: res.statusText,
      message: 'An error occurred',
      path,
    }));
    throw err;
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

async function tryRefresh(): Promise<boolean> {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) return false;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    tokenStorage.set(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────
export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};
