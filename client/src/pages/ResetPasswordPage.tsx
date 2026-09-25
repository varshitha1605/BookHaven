import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useValidateResetTokenQuery, useResetPasswordMutation } from '@/store/api/authApi';
import Spinner from '@/components/common/Spinner';
import type { ApiError } from '@/types/api';

const MIN_PASSWORD_LEN = 8;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const { data: validation, isLoading: validating } = useValidateResetTokenQuery(token, {
    skip: !token,
  });

  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [serverError, setServerError] = useState('');
  const [done, setDone] = useState(false);

  if (!token) {
    return <InvalidLink reason="No reset token provided." />;
  }

  if (validating) {
    return <div className="flex justify-center py-20"><Spinner /></div>;
  }

  if (!validation?.valid) {
    return <InvalidLink reason="This reset link is invalid or has expired. Please request a new one." />;
  }

  function validate() {
    const e: { password?: string; confirm?: string } = {};
    if (password.length < MIN_PASSWORD_LEN) e.password = `Password must be at least ${MIN_PASSWORD_LEN} characters`;
    if (!/[A-Z]/.test(password)) e.password = (e.password ?? '') + ' Include at least one uppercase letter.';
    if (confirm !== password) e.confirm = 'Passwords do not match';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setServerError('');

    try {
      await resetPassword({ token, password }).unwrap();
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const msg = (err as { data?: ApiError }).data?.message ?? 'Reset failed. The link may have expired.';
      setServerError(msg);
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white rounded-2xl p-8 text-center shadow-card space-y-3" style={{ border: '1px solid #EDE7DC' }}>
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: '#5A7A5E' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-extrabold" style={{ color: '#293B32' }}>Password reset!</h2>
          <p className="text-sm" style={{ color: '#68736B' }}>Your password has been updated. Redirecting to sign in…</p>
          <Link to="/login" className="inline-block text-sm hover:underline" style={{ color: '#0F5132' }}>Sign in now →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white rounded-2xl p-8 shadow-card" style={{ border: '1px solid #EDE7DC' }}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#0F5132' }}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold" style={{ color: '#293B32' }}>Set new password</h1>
          <p className="text-sm mt-1 text-center" style={{ color: '#68736B' }}>Choose a strong password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#68736B' }}>New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                border: `1px solid ${errors.password ? '#C98268' : '#E8E2D8'}`,
                color: '#293B32',
                '--tw-ring-color': '#0F5132',
              } as React.CSSProperties}
            />
            {errors.password && <p className="text-xs mt-1" style={{ color: '#C98268' }}>{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#68736B' }}>Confirm new password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                border: `1px solid ${errors.confirm ? '#C98268' : '#E8E2D8'}`,
                color: '#293B32',
                '--tw-ring-color': '#0F5132',
              } as React.CSSProperties}
            />
            {errors.confirm && <p className="text-xs mt-1" style={{ color: '#C98268' }}>{errors.confirm}</p>}
          </div>

          {/* Password strength hint */}
          <ul className="text-xs space-y-0.5 pl-3" style={{ color: '#A8B5A0' }}>
            <li style={{ color: password.length >= MIN_PASSWORD_LEN ? '#5A7A5E' : '#A8B5A0' }}>
              {password.length >= MIN_PASSWORD_LEN ? '✓' : '•'} At least {MIN_PASSWORD_LEN} characters
            </li>
            <li style={{ color: /[A-Z]/.test(password) ? '#5A7A5E' : '#A8B5A0' }}>
              {/[A-Z]/.test(password) ? '✓' : '•'} One uppercase letter
            </li>
            <li style={{ color: /[0-9]/.test(password) ? '#5A7A5E' : '#A8B5A0' }}>
              {/[0-9]/.test(password) ? '✓' : '•'} One number (recommended)
            </li>
          </ul>

          {serverError && (
            <p className="text-xs rounded-lg p-2" style={{ color: '#C98268', backgroundColor: '#FBF4F1', border: '1px solid #EAC5B4' }}>{serverError}</p>
          )}

          <button
            type="submit"
            disabled={resetting}
            className="w-full text-white font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-60"
            style={{ backgroundColor: resetting ? '#6B8F71' : '#0F5132' }}
          >
            {resetting ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}

function InvalidLink({ reason }: { reason: string }) {
  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white rounded-2xl p-8 text-center shadow-card space-y-4" style={{ border: '1px solid #EDE7DC' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto" style={{ backgroundColor: '#FBF4F1' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: '#C98268' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-extrabold" style={{ color: '#293B32' }}>Invalid reset link</h2>
        <p className="text-sm" style={{ color: '#68736B' }}>{reason}</p>
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-1.5 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          style={{ backgroundColor: '#0F5132' }}
        >
          Request a new link
        </Link>
      </div>
    </div>
  );
}
