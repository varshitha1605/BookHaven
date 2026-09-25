import type { OrderStatus } from '@/types/api';

const config: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:   { label: 'Pending',   className: 'bg-amber-100 text-amber-800' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-blue-100 text-blue-800' },
  SHIPPED:   { label: 'Shipped',   className: 'bg-emerald-100 text-emerald-800' },
  DELIVERED: { label: 'Delivered', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
