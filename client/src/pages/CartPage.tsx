import { Link } from 'react-router-dom';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation, useClearCartMutation } from '@/store/api/cartApi';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateGuestItem, removeGuestItem, clearGuestCart } from '@/store/cartSlice';
import AuthPageShell from '@/components/layout/AuthPageShell';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import { formatINR } from '@/lib/currency';
import type { CartItemResponse } from '@/types/api';
import type { GuestCartItem } from '@/store/cartSlice';

export default function CartPage() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const guestItems = useAppSelector((s) => s.guestCart.items);
  const dispatch = useAppDispatch();

  const { data: serverCart, isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();

  if (!isAuthenticated) return <AuthPageShell><GuestCart items={guestItems} dispatch={dispatch} /></AuthPageShell>;
  if (isLoading) return <Spinner />;
  if (!serverCart || serverCart.items.length === 0) return <AuthPageShell><EmptyCart /></AuthPageShell>;

  return (
    <AuthPageShell>
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#1F2937' }}>Shopping Cart</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{serverCart.itemCount} item{serverCart.itemCount !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => clearCart()}>Clear all</Button>
      </div>

      <div className="space-y-3">
        {serverCart.items.map((item) => (
          <ServerCartItem key={item.id} item={item} onUpdate={updateItem} onRemove={removeItem} />
        ))}
      </div>

      <CartSummary subtotal={serverCart.subtotal} />
    </div>
    </AuthPageShell>
  );
}

function ServerCartItem({
  item,
  onUpdate,
  onRemove,
}: {
  item: CartItemResponse;
  onUpdate: (args: { itemId: string; quantity: number }) => void;
  onRemove: (itemId: string) => void;
}) {
  return (
    <div className="flex gap-4 bg-white border rounded-2xl p-4 transition-colors" style={{ borderColor: '#E5E7EB' }}>
      <Link to={`/books/${item.book.id}`} className="shrink-0 w-16 h-20 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
        {item.book.coverImageUrl ? <img src={item.book.coverImageUrl} className="w-full h-full object-cover" alt="" /> : <span className="text-2xl">📚</span>}
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/books/${item.book.id}`} className="font-semibold line-clamp-1 transition-colors hover:underline" style={{ color: '#1F2937' }}>
          {item.book.title}
        </Link>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{item.book.author}</p>
        <p className="font-bold mt-1" style={{ color: '#0F5132' }}>{formatINR(item.unitPrice)}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <select
          className="border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2"
          style={{ borderColor: '#E5E7EB', '--tw-ring-color': '#0F5132' } as React.CSSProperties}
          value={item.quantity}
          onChange={(e) => onUpdate({ itemId: item.id, quantity: Number(e.target.value) })}
        >
          {Array.from({ length: Math.min(item.book.stockQuantity, 10) }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <p className="text-sm font-bold text-charcoal">{formatINR(item.lineTotal)}</p>
        <button onClick={() => onRemove(item.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Remove</button>
      </div>
    </div>
  );
}

function GuestCart({ items, dispatch }: { items: GuestCartItem[]; dispatch: ReturnType<typeof useAppDispatch> }) {
  if (items.length === 0) return <EmptyCart />;
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: '#1F2937' }}>Shopping Cart</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{items.length} item{items.length !== 1 ? 's' : ''} — guest session</p>
          </div>
        <Button variant="ghost" size="sm" onClick={() => dispatch(clearGuestCart())}>Clear all</Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.bookId} className="flex gap-4 bg-white border rounded-2xl p-4 transition-colors" style={{ borderColor: '#E5E7EB' }}>
            <Link to={`/books/${item.bookId}`} className="shrink-0 w-16 h-20 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
              {item.coverImageUrl ? <img src={item.coverImageUrl} className="w-full h-full object-cover" alt="" /> : <span className="text-2xl">📚</span>}
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/books/${item.bookId}`} className="font-semibold line-clamp-1 transition-colors hover:underline" style={{ color: '#1F2937' }}>{item.title}</Link>
              <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{item.author}</p>
              <p className="font-bold mt-1" style={{ color: '#0F5132' }}>{formatINR(item.price)}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <select
                className="border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: '#E5E7EB', '--tw-ring-color': '#0F5132' } as React.CSSProperties}
                value={item.quantity}
                onChange={(e) => dispatch(updateGuestItem({ bookId: item.bookId, quantity: Number(e.target.value) }))}
              >
                {Array.from({ length: Math.min(item.stockQuantity, 10) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <p className="text-sm font-bold text-charcoal">{formatINR(item.price * item.quantity)}</p>
              <button onClick={() => dispatch(removeGuestItem(item.bookId))} className="text-xs text-red-500 hover:text-red-700 transition-colors">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <CartSummary subtotal={subtotal} />
      <div className="mt-4 rounded-xl px-4 py-3 text-sm text-center" style={{ backgroundColor: '#FBF6EC', border: '1px solid #F5E9CE', color: '#896D2E' }}>
        <Link to="/login" className="font-semibold hover:underline" style={{ color: '#0F5132' }}>Sign in</Link> or <Link to="/register" className="font-semibold hover:underline" style={{ color: '#0F5132' }}>create an account</Link> to checkout
      </div>
    </div>
  );
}

function CartSummary({ subtotal }: { subtotal: number }) {
  const FREE_THRESHOLD = 4000;
  const SHIPPING_COST = 199;
  const shipping = subtotal >= FREE_THRESHOLD ? 0 : SHIPPING_COST;
  return (
    <div className="mt-6 bg-white border rounded-2xl p-5 space-y-2 text-sm" style={{ borderColor: '#E5E7EB' }}>
      <div className="flex justify-between" style={{ color: '#6B7280' }}><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
      <div className="flex justify-between" style={{ color: '#6B7280' }}>
        <span>Shipping</span>
        <span>{shipping === 0 ? <span className="font-medium" style={{ color: '#166534' }}>FREE</span> : formatINR(shipping)}</span>
      </div>
      {subtotal < FREE_THRESHOLD && (
        <p className="text-xs" style={{ color: '#9CA3AF' }}>Add {formatINR(FREE_THRESHOLD - subtotal)} more for free shipping</p>
      )}
      <div className="flex justify-between font-bold text-base border-t pt-2" style={{ borderColor: '#F3F4F6', color: '#1F2937' }}>
        <span>Total</span><span>{formatINR(subtotal + shipping)}</span>
      </div>
      <Link to="/checkout">
        <Button className="w-full mt-2" size="lg">Proceed to Checkout</Button>
      </Link>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="text-center py-20 space-y-4">
      <div className="text-6xl">🛒</div>
      <h2 className="text-xl font-semibold" style={{ color: '#1F2937' }}>Your cart is empty</h2>
      <Link to="/browse"><Button>Browse books</Button></Link>
    </div>
  );
}
