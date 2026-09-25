import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useGetOrderQuery } from '@/store/api/ordersApi';
import AuthPageShell from '@/components/layout/AuthPageShell';
import { formatINR } from '@/lib/currency';
import Spinner from '@/components/common/Spinner';

// ── Book-stack illustration (pure SVG, no external assets) ───────────────────
function BookStackIllustration() {
  return (
    <svg
      viewBox="0 0 160 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: 160, height: 120, display: 'block' }}
    >
      {/* Shadow */}
      <ellipse cx="80" cy="112" rx="52" ry="6" fill="#C4A882" opacity="0.30" />

      {/* Book 1 — bottom, cream */}
      <rect x="22" y="80" width="116" height="26" rx="3" fill="#FAF0E0" />
      <rect x="22" y="80" width="10"  height="26" rx="2" fill="#8C1818" />
      <rect x="22" y="80" width="116" height="4"  fill="#EDE0C4" />
      <rect x="128" y="82" width="4"  height="22" fill="#E8D8C0" opacity="0.7" />

      {/* Book 2 — forest green */}
      <rect x="26" y="56" width="108" height="26" rx="3" fill="#2A7A45" />
      <rect x="26" y="56" width="10"  height="26" rx="2" fill="#1B5E35" />
      <rect x="26" y="56" width="108" height="4"  fill="#3D9660" opacity="0.6" />
      <rect x="130" y="58" width="4"  height="22" fill="#1E6B3C" opacity="0.5" />
      {/* Gold diamond on cover */}
      <polygon points="80,64 86,70 80,76 74,70" fill="none" stroke="#C9A96A" strokeWidth="1" opacity="0.70" />
      <circle cx="80" cy="70" r="1.5" fill="#C9A96A" opacity="0.60" />

      {/* Book 3 — navy */}
      <rect x="30" y="32" width="100" height="26" rx="3" fill="#1C3E7A" />
      <rect x="30" y="32" width="10"  height="26" rx="2" fill="#0E2A5C" />
      <rect x="30" y="32" width="100" height="4"  fill="#2A5AAA" opacity="0.6" />
      <rect x="126" y="34" width="4"  height="22" fill="#E8DCC0" opacity="0.55" />
      {/* Gold border on cover */}
      <rect x="43" y="38" width="74" height="14" rx="1" fill="none" stroke="#C9A96A" strokeWidth="0.8" opacity="0.55" />

      {/* Book 4 — top, terracotta */}
      <rect x="34" y="10" width="92" height="24" rx="3" fill="#C84820" />
      <rect x="34" y="10" width="10" height="24" rx="2" fill="#8C2808" />
      <rect x="34" y="10" width="92" height="4"  fill="#E06840" opacity="0.6" />
      <rect x="122" y="12" width="4" height="20" fill="#E8DCC0" opacity="0.55" />
      {/* Circle medallion */}
      <circle cx="80" cy="22" r="7" fill="#A83810" opacity="0.55" />
      <circle cx="80" cy="22" r="5" fill="none" stroke="#F0A070" strokeWidth="0.8" opacity="0.65" />

      {/* Gold bookmark ribbon on green book */}
      <path d="M38 56 L43 56 L43 72 L40.5 70 L38 72 Z" fill="#D4A84B" />

      {/* Checkmark circle — top right of stack */}
      <circle cx="130" cy="16" r="14" fill="#0F5132" />
      <circle cx="130" cy="16" r="12" fill="#186B44" />
      <path d="M124 16 L128 20 L137 11" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ── OrderSuccessPage ──────────────────────────────────────────────────────────
export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrderQuery(id!);

  // Guard: if the order is in a terminal non-success state, redirect to order details
  useEffect(() => {
    if (order && order.status === 'CANCELLED') {
      navigate(`/orders/${id}`, { replace: true });
    }
  }, [order, id, navigate]);

  if (isLoading) return <Spinner />;
  if (!order) return <p className="text-center text-gray-500 py-20">Order not found.</p>;

  const formattedDate = new Date(order.placedAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <AuthPageShell>
    <div className="max-w-lg mx-auto py-8 px-4">
      {/* ── Main card ── */}
      <div
        className="rounded-3xl overflow-hidden shadow-lg"
        style={{ background: 'linear-gradient(160deg, #F9F4EC 0%, #FFF8F2 100%)', border: '1px solid #E8D8C0' }}
      >
        {/* Top accent bar */}
        <div style={{ height: 6, background: 'linear-gradient(90deg, #0F5132 0%, #2A7A45 50%, #C9A96A 100%)' }} />

        <div className="px-8 pt-8 pb-6 text-center space-y-5">
          {/* Illustration */}
          <div className="flex justify-center">
            <BookStackIllustration />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1
              className="text-2xl font-extrabold leading-tight"
              style={{ color: '#0F5132', fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Your next great read is on its way!
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed max-w-xs mx-auto">
              Thank you for your purchase. Your order has been placed and is now being processed.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: '#E8D0B0' }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#C9A96A' }}>Order Summary</span>
            <div className="flex-1 h-px" style={{ background: '#E8D0B0' }} />
          </div>

          {/* Order summary card */}
          <div
            className="rounded-2xl px-5 py-4 text-left space-y-2.5 text-sm"
            style={{ background: 'white', border: '1px solid #E8D8C0' }}
          >
            <div className="flex justify-between items-center">
              <span className="text-stone-500 font-medium">Order number</span>
              <span className="font-bold text-stone-800 font-mono text-xs tracking-wider">#{order.id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500 font-medium">Date placed</span>
              <span className="font-semibold text-stone-700">{formattedDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500 font-medium">Items</span>
              <span className="font-semibold text-stone-700">
                {order.items.reduce((sum, i) => sum + i.quantity, 0)} book{order.items.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="h-px" style={{ background: '#F0E8D8' }} />
            <div className="flex justify-between items-center">
              <span className="text-stone-500 font-medium">Total paid</span>
              <span className="font-extrabold text-base" style={{ color: '#0F5132' }}>{formatINR(order.total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500 font-medium">Payment</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: '#D1FAE5', color: '#065F46' }}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5 pt-1">
            <Link
              to={`/orders/${order.id}`}
              className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
              style={{ background: 'linear-gradient(135deg, #0F5132 0%, #186B44 100%)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View Order Details
            </Link>
            <Link
              to="/browse"
              className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold transition-all hover:opacity-80 active:scale-[0.98]"
              style={{ background: '#FDF6EC', color: '#0F5132', border: '1px solid #D4A84B' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <div
          className="px-8 py-4 text-center text-xs text-stone-400 border-t"
          style={{ borderColor: '#EDE0C8', background: '#FDF8F0' }}
        >
          A confirmation has been recorded for your order. You can view it anytime under{' '}
          <Link to="/orders" className="font-semibold underline-offset-2 hover:underline" style={{ color: '#0F5132' }}>
            My Orders
          </Link>.
        </div>
      </div>
    </div>
    </AuthPageShell>
  );
}
