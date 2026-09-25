import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrderQuery, useCancelOrderMutation, useBuyAgainMutation } from '@/store/api/ordersApi';
import AuthPageShell from '@/components/layout/AuthPageShell';
import { formatINR } from '@/lib/currency';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { ApiError } from '@/types/api';

// ── Cancellation Modal ────────────────────────────────────────────────────────
interface CancelModalProps {
  onConfirm: (reason: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

function CancelModal({ onConfirm, onClose, isLoading }: CancelModalProps) {
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);
  const isValid = reason.trim().length >= 5;
  const showError = touched && !isValid;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onConfirm(reason.trim());
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Dialog */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b" style={{ borderColor: '#F3F4F6' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-800">Cancel Order</h2>
              <p className="text-xs text-stone-500 mt-0.5">This action cannot be undone.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label htmlFor="cancel-reason" className="block text-sm font-semibold text-stone-700 mb-1.5">
              Reason for cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              id="cancel-reason"
              value={reason}
              onChange={(e) => { setReason(e.target.value); setTouched(false); }}
              onBlur={() => setTouched(true)}
              placeholder="Please describe why you are cancelling this order…"
              rows={4}
              disabled={isLoading}
              className={`w-full rounded-xl border px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 transition-all ${
                showError
                  ? 'border-red-300 focus:ring-red-400 bg-red-50'
                  : 'bg-gray-50 focus:bg-white'
              }`}
              style={!showError ? { borderColor: '#E5E7EB', '--tw-ring-color': '#0F5132' } as React.CSSProperties : {}}
            />
            {showError && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Please enter at least 5 characters.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
              style={{ color: '#374151', backgroundColor: '#F3F4F6' }}
            >
              Keep Order
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Cancelling…
                </>
              ) : (
                'Cancel Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── OrderDetailPage ───────────────────────────────────────────────────────────
export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: order, isLoading } = useGetOrderQuery(id!);
  const [cancelOrder, { isLoading: cancelling, error: cancelError }] = useCancelOrderMutation();
  const [buyAgain, { isLoading: buyingAgain }] = useBuyAgainMutation();

  if (isLoading) return <Spinner />;
  if (!order) return <p className="text-center text-gray-500 py-20">Order not found.</p>;

  const canCancel =
    (order.status === 'PENDING' || order.status === 'CONFIRMED') &&
    order.cancellableUntil !== null &&
    new Date() < new Date(order.cancellableUntil);

  async function handleCancel(reason: string) {
    if (!id) return;
    try {
      await cancelOrder({ id, reason }).unwrap();
      setShowCancelModal(false);
    } catch { /* shown via cancelError */ }
  }

  async function handleBuyAgain() {
    if (!id) return;
    await buyAgain(id).unwrap().catch(() => {});
  }

  const cancelErrorMsg = cancelError
    ? ((cancelError as { data: ApiError }).data?.message ?? 'Cancellation failed')
    : undefined;

  // ── Status-aware alert (shown for notable non-success statuses) ──────────
  type AlertConfig = {
    bg: string; border: string;
    iconColor: string; iconPath: string;
    headingColor: string; heading: string;
    bodyColor: string; body: string;
  };

  const s = order.status;
  const alert = ((): AlertConfig | null => {
    if (s === 'CANCELLED') {
      return {
        bg: 'bg-red-50', border: 'border-red-200',
        iconColor: 'text-red-500',
        iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
        headingColor: 'text-red-800',
        heading: 'Order cancelled',
        bodyColor: 'text-red-700',
        body: 'This order has been cancelled. If you have any questions, please contact support.',
      };
    }
    if (s === 'PENDING') {
      return {
        bg: 'bg-amber-50', border: 'border-amber-200',
        iconColor: 'text-amber-500',
        iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        headingColor: 'text-amber-800',
        heading: 'Order pending',
        bodyColor: 'text-amber-700',
        body: 'Your order is awaiting confirmation.',
      };
    }
    if (s === 'SHIPPED') {
      return {
        bg: 'bg-blue-50', border: 'border-blue-200',
        iconColor: 'text-blue-500',
        iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        headingColor: 'text-blue-800',
        heading: 'Order shipped',
        bodyColor: 'text-blue-700',
        body: 'Your order is on its way!',
      };
    }
    if (s === 'DELIVERED') {
      return {
        bg: 'bg-emerald-50', border: 'border-emerald-200',
        iconColor: 'text-emerald-500',
        iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        headingColor: 'text-emerald-800',
        heading: 'Order delivered',
        bodyColor: 'text-emerald-700',
        body: 'Your order has been delivered. Enjoy your books!',
      };
    }
    return null;
  })();

  return (
    <AuthPageShell>
      {/* Cancellation modal */}
      {showCancelModal && (
        <CancelModal
          onConfirm={handleCancel}
          onClose={() => setShowCancelModal(false)}
          isLoading={cancelling}
        />
      )}

      <div className="max-w-2xl mx-auto space-y-6">
        {alert && (
          <div className={`${alert.bg} border ${alert.border} rounded-2xl p-4 flex items-start gap-3`}>
            <svg className={`w-5 h-5 ${alert.iconColor} shrink-0 mt-0.5`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={alert.iconPath} />
            </svg>
            <div>
              <p className={`text-sm font-semibold ${alert.headingColor}`}>{alert.heading}</p>
              <p className={`text-xs ${alert.bodyColor} mt-0.5`}>{alert.body}</p>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-stone-800">Order Details</h1>
            <p className="text-sm text-stone-500 mt-1">
              Placed {new Date(order.placedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(order.placedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          {/* Only show the status badge when there is no top alert banner,
              to avoid two competing colored status indicators on the same page. */}
          {!alert && <OrderStatusBadge status={order.status} />}
        </div>

        {/* Items */}
        <section className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border-b border-stone-100 last:border-b-0">
              <Link to={`/books/${item.book.id}`} className="shrink-0 w-14 h-18 bg-stone-50 rounded-lg flex items-center justify-center overflow-hidden">
                {item.book.coverImageUrl
                  ? <img src={item.book.coverImageUrl} className="w-full h-full object-cover" alt="" />
                  : <span className="text-2xl">📚</span>}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/books/${item.book.id}`} className="font-medium line-clamp-1 text-sm transition-colors hover:underline" style={{ color: '#1F2937' }}>{item.book.title}</Link>
                <p className="text-xs text-stone-500 mt-0.5">{item.book.author}</p>
              </div>
              <div className="text-right text-sm shrink-0">
                <p className="text-stone-500">{item.quantity} × {formatINR(item.unitPrice)}</p>
                <p className="font-bold text-stone-800">{formatINR(item.lineTotal)}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Totals */}
        <section className="bg-white border border-stone-200 rounded-2xl p-5 space-y-2 text-sm">
          <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
          <div className="flex justify-between text-stone-600"><span>Shipping</span><span>{order.shippingCost === 0 ? <span className="text-emerald-600 font-medium">FREE</span> : formatINR(order.shippingCost)}</span></div>
          <div className="flex justify-between font-bold text-base border-t pt-2" style={{ borderColor: '#F3F4F6', color: '#1F2937' }}><span>Total</span><span>{formatINR(order.total)}</span></div>
          <div className="flex justify-between text-stone-500 pt-1"><span>Payment</span><span>{order.paymentMethod.replace(/_/g, ' ')} · {order.paymentStatus}</span></div>
        </section>

        {/* Shipping address */}
        <section className="bg-white border border-stone-200 rounded-2xl p-5">
          <h2 className="font-bold text-stone-800 mb-3">Shipping Address</h2>
          <address className="text-sm text-stone-600 not-italic space-y-0.5">
            {order.shippingAddress.recipientName && <p className="font-medium text-stone-800">{order.shippingAddress.recipientName}</p>}
            {order.shippingAddress.phoneNumber && <p>{order.shippingAddress.phoneNumber}</p>}
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#0F5132' }}>{order.shippingAddress.label}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </address>
        </section>

        {order.cancelledAt && (
          <p className="text-sm text-red-600">
            Cancelled on {new Date(order.cancelledAt).toLocaleString()}
            {order.cancelReason && ` — "${order.cancelReason}"`}
          </p>
        )}

        <ErrorMessage message={cancelErrorMsg} />

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          {canCancel && (
            <Button variant="danger" size="sm" loading={cancelling} onClick={() => setShowCancelModal(true)}>
              Cancel order
            </Button>
          )}
          <Button variant="secondary" size="sm" loading={buyingAgain} onClick={handleBuyAgain}>
            Buy again
          </Button>
          <Link to="/orders"><Button variant="ghost" size="sm">← Back to orders</Button></Link>
        </div>
      </div>
    </AuthPageShell>
  );
}
