/**
 * SupportWidget — floating support FAB + slide-in panel
 *
 * Fixed bottom-right on all pages via Layout.tsx.
 * Clicking the FAB opens a right-side panel.
 * Panel closes on: close button click, overlay click (desktop), or Escape key.
 * All support options link to the existing /support page so no functionality
 * is fabricated — the panel is a real navigation aid.
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ── Support options ───────────────────────────────────────────────────────────

const OPTIONS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    label: 'Chat with us',
    sub: 'Get instant support',
    to: '/support',
    iconBg: '#EBF0E9',
    iconColor: '#3F6B50',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: 'Email us',
    sub: 'support@bookhaven.demo',
    to: '/support',
    iconBg: '#FBF6EC',
    iconColor: '#A8883E',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
    label: 'FAQs',
    sub: 'Find quick answers',
    to: '/support',
    iconBg: '#EAF0F5',
    iconColor: '#2E6A9A',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    label: 'Order Support',
    sub: 'Track, return or cancel orders',
    to: '/orders',
    iconBg: '#F5EAEA',
    iconColor: '#B05C5C',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    // Slight delay so the FAB click doesn't immediately close
    const t = setTimeout(() => document.addEventListener('mousedown', onPointer), 100);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [open]);

  return (
    <>
      {/* ── Slide-in panel ──────────────────────────────────────── */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Support panel"
          aria-modal="true"
          style={{
            position: 'fixed',
            bottom: 82,
            right: 20,
            width: 300,
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
            border: '1px solid #EDE7DC',
            zIndex: 9999,
            overflow: 'hidden',
            // Animate in
            animation: 'support-panel-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 18px 14px',
              borderBottom: '1px solid #F0EBE3',
            }}
          >
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#293B32', lineHeight: 1.2 }}>
                How can we help you?
              </p>
              <p style={{ fontSize: 11, color: '#68736B', marginTop: 2 }}>
                We're here for you
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close support panel"
              style={{
                width: 28, height: 28,
                borderRadius: 8,
                border: 'none',
                backgroundColor: '#F6F4EF',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#68736B',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Options */}
          <div style={{ padding: '8px 0 10px' }}>
            {OPTIONS.map((opt) => (
              <Link
                key={opt.label}
                to={opt.to}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 18px',
                  textDecoration: 'none',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F6F4EF')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {/* Icon chip */}
                <span style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  backgroundColor: opt.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: opt.iconColor,
                }}>
                  {opt.icon}
                </span>
                {/* Text */}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#293B32' }}>
                    {opt.label}
                  </span>
                  <span style={{ display: 'block', fontSize: 11, color: '#68736B', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {opt.sub}
                  </span>
                </span>
                {/* Chevron */}
                <svg width="14" height="14" fill="none" stroke="#A8B5A0" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Footer tip */}
          <div style={{ padding: '10px 18px 14px', borderTop: '1px solid #F0EBE3' }}>
            <p style={{ fontSize: 10.5, color: '#A8B5A0', lineHeight: 1.5 }}>
              📚 <em>Books make a kinder, brighter you.</em>
            </p>
          </div>
        </div>
      )}

      {/* ── Floating Action Button — pill "Need help?" ─────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close support' : 'Open support'}
        aria-expanded={open}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 20,
          height: 46,
          paddingLeft: open ? 14 : 18,
          paddingRight: open ? 14 : 20,
          borderRadius: 999,
          backgroundColor: open ? '#1F3A2A' : '#0F5132',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: open ? 0 : 8,
          boxShadow: '0 4px 24px rgba(15,81,50,0.40)',
          zIndex: 9999,
          transition: 'background 0.18s, box-shadow 0.18s, padding 0.18s',
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0A3D26';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(15,81,50,0.50)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = open ? '#1F3A2A' : '#0F5132';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(15,81,50,0.40)';
        }}
      >
        {open ? (
          // X icon when panel is open — keep pill compact
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            {/* Headset icon */}
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 12a9 9 0 1118 0M3 12v2a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H5a2 2 0 00-2 2v1zm15 0v2a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h1a2 2 0 012 2v1z" />
            </svg>
            {/* Label */}
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.01em' }}>
              Need help?
            </span>
          </>
        )}
      </button>

      {/* Keyframe injection */}
      <style>{`
        @keyframes support-panel-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </>
  );
}
