import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';

function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-2xl overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F0F7F4', color: '#0F5132' }}>
            {icon}
          </span>
          <span className="font-semibold text-sm" style={{ color: '#1F2937' }}>{title}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="bg-white px-5 py-4" style={{ borderTop: '1px solid #F3F4F6' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-2.5 last:border-0" style={{ borderBottom: '1px solid #F9FAFB' }}>
      <dt className="text-xs font-semibold uppercase tracking-wide w-32 shrink-0" style={{ color: '#9CA3AF' }}>{label}</dt>
      <dd className="text-sm font-medium" style={{ color: '#1F2937' }}>{value ?? <span className="italic" style={{ color: '#9CA3AF' }}>Not set</span>}</dd>
    </div>
  );
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <p className="text-lg" style={{ color: '#6B7280' }}>You need to be logged in to view your profile.</p>
        <Link to="/login" className="inline-flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm" style={{ backgroundColor: '#0F5132' }}>
          Sign in
        </Link>
      </div>
    );
  }

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  const joinDate = undefined; // createdAt not returned in UserSummary — would require a /me endpoint

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#1F2937' }}>My Profile</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Manage your account and preferences</p>
      </div>

      {/* Avatar + name card */}
      <div className="rounded-2xl p-6 text-white flex items-center gap-5" style={{ backgroundColor: '#0F5132' }}>
        <div className="w-16 h-16 rounded-full text-white flex items-center justify-center text-2xl font-extrabold shrink-0 select-none" style={{ backgroundColor: '#C9A96A' }}>
          {initials}
        </div>
        <div>
          <p className="text-lg font-extrabold leading-tight">{fullName}</p>
          <p className="text-sm mt-0.5" style={{ color: '#D6EDE3' }}>{user.email}</p>
          <span className="mt-1.5 inline-block text-[10px] font-semibold rounded-full px-2 py-0.5 uppercase tracking-wide" style={{ backgroundColor: 'rgba(201,169,106,0.2)', color: '#C9A96A', border: '1px solid rgba(201,169,106,0.3)' }}>
            {user.role === 'ADMIN' ? 'Administrator' : 'Member'}
          </span>
        </div>
      </div>

      {/* Profile Details accordion */}
      <AccordionSection
        title="Profile Details"
        defaultOpen
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      >
        <dl>
          <Field label="Full Name" value={fullName} />
          <Field label="First Name" value={user.firstName} />
          <Field label="Last Name" value={user.lastName} />
          <Field label="Email" value={user.email} />
          <Field label="Username" value={user.email.split('@')[0]} />
          <Field label="Role" value={user.role === 'ADMIN' ? 'Administrator' : 'Member'} />
          {joinDate && <Field label="Member Since" value={joinDate} />}
        </dl>
        <p className="text-xs text-gray-400 mt-3 italic">
          To update your name or email, please contact support. Passwords are never displayed.
        </p>
      </AccordionSection>

      {/* Quick links accordion */}
      <AccordionSection
        title="My Orders"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
          </svg>
        }
      >
        <p className="text-sm text-gray-600 mb-3">View your past orders, track deliveries, and reorder items.</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          style={{ color: '#0F5132' }}
        >
          View order history →
        </Link>
      </AccordionSection>

      {/* Saved addresses accordion */}
      <AccordionSection
        title="Saved Addresses"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      >
        <p className="text-sm text-gray-600 mb-3">Manage your delivery addresses. You can add or update addresses during checkout.</p>
        <Link
          to="/checkout"
          className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          style={{ color: '#0F5132' }}
        >
          Manage during checkout →
        </Link>
      </AccordionSection>

      {/* Help accordion */}
      <AccordionSection
        title="Help & Support"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <p className="text-sm text-gray-600 mb-3">Have a question or need help with an order?</p>
        <Link
          to="/support"
          className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          style={{ color: '#0F5132' }}
        >
          Visit Help & Support →
        </Link>
      </AccordionSection>
    </div>
  );
}
