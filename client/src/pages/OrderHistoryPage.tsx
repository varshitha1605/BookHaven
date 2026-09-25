import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useListOrdersQuery } from '@/store/api/ordersApi';
import { formatINR } from '@/lib/currency';
import Spinner from '@/components/common/Spinner';
import Pagination from '@/components/common/Pagination';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';

export default function OrderHistoryPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useListOrdersQuery({ page, size: 10 });

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold" style={{ color: '#1F2937' }}>Order History</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>View your past orders and track their status</p>
      </div>

      {!data || data.content.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border space-y-3" style={{ borderColor: '#E5E7EB' }}>
          <div className="text-5xl">📦</div>
          <p className="font-semibold" style={{ color: '#1F2937' }}>No orders yet</p>
          <p className="text-sm" style={{ color: '#6B7280' }}>When you place an order, it will appear here.</p>
          <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline mt-1" style={{ color: '#0F5132' }}>
            Browse books →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {data.content.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white border rounded-2xl p-5 hover:shadow-card transition-all group"
              style={{ borderColor: '#E5E7EB' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs mb-1" style={{ color: '#9CA3AF' }}>
                    {new Date(order.placedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="font-semibold transition-colors" style={{ color: '#1F2937' }}>
                    {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
                    {formatINR(order.total)} · {order.paymentMethod.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <OrderStatusBadge status={order.status} />
                  <svg className="w-4 h-4 transition-colors" style={{ color: '#D1D5DB' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              {order.cancellableUntil && order.status !== 'CANCELLED' && (
                <p className="text-xs rounded-lg px-2 py-1 mt-2 inline-block" style={{ color: '#896D2E', backgroundColor: '#FBF6EC' }}>
                  Cancellable until {new Date(order.cancellableUntil).toLocaleString('en-IN')}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={data?.pagination.totalPages ?? 0} onPageChange={setPage} />
    </div>
  );
}
