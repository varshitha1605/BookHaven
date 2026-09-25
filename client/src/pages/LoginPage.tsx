import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation, useMergeCartMutation } from '@/store/api/authApi';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCredentials } from '@/store/authSlice';
import { clearGuestCart } from '@/store/cartSlice';
import Input from '@/components/common/Input';
import ErrorMessage from '@/components/common/ErrorMessage';
import BookHavenLogo from '@/components/common/BookHavenLogo';
import AuthPageShell from '@/components/layout/AuthPageShell';
import type { ApiError } from '@/types/api';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';
  const guestItems = useAppSelector((s) => s.guestCart.items);

  const [login, { isLoading: isLogging, error: loginError }] = useLoginMutation();
  const [mergeCart] = useMergeCartMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }));

      // Merge guest cart after login
      if (guestItems.length > 0) {
        await mergeCart({ items: guestItems.map((i) => ({ bookId: i.bookId, quantity: i.quantity })) })
          .unwrap()
          .catch(() => {/* merge errors are non-fatal */});
        dispatch(clearGuestCart());
      }

      navigate(from, { replace: true });
    } catch {
      // error displayed via loginError below
    }
  }

  // Better error messages for common scenarios
  const friendlyErrorMsg = loginError
    ? (() => {
        const msg = (loginError as { data?: ApiError }).data?.message ?? '';
        const status = (loginError as { status?: number }).status;
        if (status === 401 || msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credentials') || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('email')) {
          return 'Incorrect email or password. Please check and try again.';
        }
        if (status === 429) return 'Too many login attempts. Please wait a few minutes and try again.';
        if (status === 0 || status === 503) return 'Cannot reach the server. Please check your connection.';
        return msg || 'Sign in failed. Please try again.';
      })()
    : undefined;

  return (
    <AuthPageShell>
    <div
      className="max-w-sm mx-auto"
      style={{ paddingTop: '48px', paddingBottom: '64px' }}
    >
      <div
        className="bg-white rounded-2xl shadow-md"
        style={{ border: '1px solid #E8E2D8', padding: '36px 32px 32px' }}
      >

        {/* Logo — centred, no border, no outline */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <BookHavenLogo variant="auth" noLink />
        </div>

        {/* Heading */}
        <div className="text-center" style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#0F5132',
              fontFamily: 'Georgia, "Times New Roman", serif',
              lineHeight: 1.2,
              marginBottom: 4,
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: 13.5, color: '#6B7280' }}>
            Sign in to your BookHaven account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold" style={{ color: '#374151' }}>Password</label>
              <Link
                to="/forgot-password"
                className="text-xs hover:underline font-medium"
                style={{ color: '#0F5132' }}
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <ErrorMessage message={friendlyErrorMsg} />

          <button
            type="submit"
            disabled={isLogging}
            className="w-full text-sm font-semibold text-white rounded-xl transition-colors shadow-sm disabled:opacity-60"
            style={{ backgroundColor: '#0F5132', padding: '11px 0', marginTop: 4 }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0A3D26')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0F5132')}
          >
            {isLogging ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in…
              </span>
            ) : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-sm text-center" style={{ color: '#6B7280' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-medium hover:underline" style={{ color: '#0F5132' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
    </AuthPageShell>
  );
}
