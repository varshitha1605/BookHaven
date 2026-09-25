import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '@/store/api/authApi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [devToken, setDevToken] = useState('');
  const [fieldError, setFieldError] = useState('');

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setFieldError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFieldError('Enter a valid email address'); return; }
    setFieldError('');

    try {
      const result = await forgotPassword({ email: email.trim().toLowerCase() }).unwrap();
      setDevToken(result.devToken ?? '');
      setSubmitted(true);
    } catch {
      // Even on error show the same message — don't leak whether email exists
      setSubmitted(true);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      {/* Card */}
      <div className="bg-white rounded-2xl p-8 shadow-card" style={{ border: '1px solid #EDE7DC' }}>
        {/* Logo area */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#0F5132' }}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold" style={{ color: '#293B32' }}>Forgot your password?</h1>
          <p className="text-sm mt-1 text-center" style={{ color: '#68736B' }}>Enter your email and we'll send you a reset link</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#68736B' }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldError(''); }}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  border: `1px solid ${fieldError ? '#C98268' : '#E8E2D8'}`,
                  color: '#293B32',
                  '--tw-ring-color': '#0F5132',
                } as React.CSSProperties}
              />
              {fieldError && <p className="text-xs mt-1" style={{ color: '#C98268' }}>{fieldError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-60"
              style={{ backgroundColor: isLoading ? '#6B8F71' : '#0F5132' }}
            >
              {isLoading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Safe confirmation — same message regardless of whether email exists */}
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#F0F7F1', border: '1px solid #D6EDD9' }}>
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: '#5A7A5E' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold text-sm" style={{ color: '#486250' }}>Check your email</p>
              <p className="text-xs mt-1" style={{ color: '#5A7A5E' }}>
                If an account exists for <strong>{email}</strong>, a password reset link has been generated.
              </p>
            </div>

            {/* DEV NOTICE — only shown when a token was returned */}
            {devToken && (
              <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: '#FBF6EC', border: '1px solid #EBCEA1' }}>
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#896D2E' }}>🛠 Development mode only</p>
                <p className="text-xs leading-relaxed" style={{ color: '#A8883E' }}>
                  Email sending is not configured. Use the token below to reset your password directly.
                  <strong> This token would never be shown in production.</strong>
                </p>
                <div className="bg-white rounded-lg p-2 break-all font-mono text-xs select-all" style={{ border: '1px solid #EBCEA1', color: '#896D2E' }}>
                  {devToken}
                </div>
                <Link
                  to={`/reset-password?token=${encodeURIComponent(devToken)}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                  style={{ color: '#0F5132' }}
                >
                  → Go to Reset Password page
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm hover:underline" style={{ color: '#0F5132' }}>← Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
