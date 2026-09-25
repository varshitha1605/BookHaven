import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useListAddressesQuery, useAddAddressMutation } from '@/store/api/cartApi';
import { usePlaceOrderMutation } from '@/store/api/ordersApi';
import { useGetCartQuery } from '@/store/api/cartApi';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ErrorMessage from '@/components/common/ErrorMessage';
import AuthPageShell from '@/components/layout/AuthPageShell';
import { formatINR } from '@/lib/currency';
import type { ApiError, PaymentMethod } from '@/types/api';

// Indian mobile: 10 digits, optionally prefixed with +91 or 0
const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;

const addressSchema = z.object({
  recipientName: z.string().min(2, 'Full name is required').max(200),
  phoneNumber: z.string().regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number'),
  label: z.string().min(1, 'Label is required'),
  country: z.string().min(1, 'Country is required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(6, 'Enter a valid postal code').max(10),
});
type AddressForm = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: addresses, isLoading: loadingAddresses } = useListAddressesQuery();
  const { data: cart, isLoading: loadingCart } = useGetCartQuery();
  const [addAddress, { isLoading: savingAddress }] = useAddAddressMutation();
  const [placeOrder, { isLoading: placingOrder, error: orderError }] = usePlaceOrderMutation();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PAYPAL');
  const [showNewAddress, setShowNewAddress] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'India' },
  });

  if (loadingAddresses || loadingCart) return <Spinner />;
  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const FREE_THRESHOLD = 4000;
  const shipping = cart.subtotal >= FREE_THRESHOLD ? 0 : 199;
  const total = cart.subtotal + shipping;

  async function handleSaveAddress(values: AddressForm) {
    try {
      const saved = await addAddress({ ...values, isDefault: false }).unwrap();
      setSelectedAddressId(saved.id);
      setShowNewAddress(false);
      reset({ country: 'India' });
    } catch { /* shown via error */ }
  }

  async function handlePlaceOrder() {
    if (!selectedAddressId) return;
    try {
      const order = await placeOrder({ addressId: selectedAddressId, paymentMethod }).unwrap();
      navigate(`/orders/${order.id}/success`);
    } catch { /* shown via orderError */ }
  }

  const orderErrorMsg = orderError
    ? ((orderError as { data: ApiError }).data?.message ?? 'Order failed')
    : undefined;

  return (
    <AuthPageShell>
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold" style={{ color: '#1F2937' }}>Checkout</h1>

      {/* ── Step 1: Delivery address ──────────────────── */}
      <section className="bg-white border rounded-2xl p-6 space-y-4" style={{ borderColor: '#E5E7EB' }}>
        <h2 className="font-bold flex items-center gap-2" style={{ color: '#1F2937' }}>
          <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: '#0F5132' }}>1</span>
          Delivery address
        </h2>

        {/* Saved addresses */}
        {addresses && addresses.length > 0 && (
          <div className="space-y-2">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border hover:border-green-400 transition-colors has-[:checked]:bg-green-50"
                style={{ borderColor: '#E5E7EB' }}
              >
                <input
                  type="radio"
                  name="address"
                  value={addr.id}
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                  className="mt-0.5"
                  style={{ accentColor: '#0F5132' }}
                />
                <div className="text-sm flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold" style={{ color: '#1F2937' }}>{addr.label}</p>
                    {addr.isDefault && <span className="text-xs font-medium rounded px-1.5 py-0.5" style={{ color: '#0F5132', backgroundColor: '#F0F7F4' }}>Default</span>}
                  </div>
                  {addr.recipientName && <p className="text-gray-700 font-medium">{addr.recipientName}</p>}
                  {addr.phoneNumber && <p className="text-gray-500">{addr.phoneNumber}</p>}
                  <p className="text-gray-600">{addr.street}</p>
                  <p className="text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p className="text-gray-600">{addr.country}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        <button
          type="button"
          className="text-sm hover:underline font-medium flex items-center gap-1"
          style={{ color: '#0F5132' }}
          onClick={() => setShowNewAddress((v) => !v)}
        >
          {showNewAddress ? '↑ Hide form' : '+ Add a new address'}
        </button>

        {/* New address form */}
        {showNewAddress && (
          <form onSubmit={handleSubmit(handleSaveAddress)} className="space-y-3 pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
            {/* Row 1: Name + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Full Name *"
                placeholder="e.g. Priya Sharma"
                error={errors.recipientName?.message}
                {...register('recipientName')}
              />
              <Input
                label="Phone Number *"
                placeholder="e.g. 9876543210"
                error={errors.phoneNumber?.message}
                {...register('phoneNumber')}
              />
            </div>
            {/* Row 2: Label + Country */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Label *"
                placeholder="e.g. Home, Office"
                error={errors.label?.message}
                {...register('label')}
              />
              <Input
                label="Country *"
                placeholder="India"
                error={errors.country?.message}
                {...register('country')}
              />
            </div>
            {/* Row 3: Street */}
            <Input
              label="Street Address *"
              placeholder="e.g. 42, MG Road, Koramangala"
              error={errors.street?.message}
              {...register('street')}
            />
            {/* Row 4: City + State + Postal */}
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="City *"
                placeholder="Bengaluru"
                error={errors.city?.message}
                {...register('city')}
              />
              <Input
                label="State *"
                placeholder="Karnataka"
                error={errors.state?.message}
                {...register('state')}
              />
              <Input
                label="Postal Code *"
                placeholder="560095"
                error={errors.postalCode?.message}
                {...register('postalCode')}
              />
            </div>
            <Button type="submit" loading={savingAddress} variant="secondary" size="sm">
              Save address
            </Button>
          </form>
        )}

        {!selectedAddressId && !showNewAddress && (
          <p className="text-xs rounded-lg px-3 py-2" style={{ color: '#896D2E', backgroundColor: '#FBF6EC', border: '1px solid #F5E9CE' }}>
            Please select or add a delivery address to continue.
          </p>
        )}
      </section>

      {/* ── Step 2: Payment ───────────────────────────── */}
      <section className="bg-white border rounded-2xl p-6 space-y-4" style={{ borderColor: '#E5E7EB' }}>
        <h2 className="font-bold flex items-center gap-2" style={{ color: '#1F2937' }}>
          <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: '#0F5132' }}>2</span>
          Payment method
        </h2>
        <div className="space-y-2">
          {(['PAYPAL', 'CREDIT_CARD', 'DEBIT_CARD', 'STRIPE'] as PaymentMethod[]).map((method) => (
            <label
              key={method}
              className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border hover:border-green-400 transition-colors has-[:checked]:bg-green-50"
              style={{ borderColor: '#E5E7EB' }}
            >
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
                style={{ accentColor: '#0F5132' }}
              />
              <span className="text-sm font-medium" style={{ color: '#1F2937' }}>{method.replace(/_/g, ' ')}</span>
            </label>
          ))}
        </div>
        {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && (
          <p className="text-xs rounded-lg p-2" style={{ color: '#6B7280', backgroundColor: '#FDFCF8', border: '1px solid #F2EDE0' }}>
            💳 Card payments use Stripe test mode — no real charges will be made.
          </p>
        )}
      </section>

      {/* ── Step 3: Order summary ─────────────────────── */}
      <section className="bg-white border rounded-2xl p-6 space-y-3" style={{ borderColor: '#E5E7EB' }}>
        <h2 className="font-bold flex items-center gap-2" style={{ color: '#1F2937' }}>
          <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: '#0F5132' }}>3</span>
          Order summary
        </h2>
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="truncate flex-1" style={{ color: '#374151' }}>{item.book.title} × {item.quantity}</span>
            <span className="font-medium ml-4">{formatINR(item.lineTotal)}</span>
          </div>
        ))}
        <div className="pt-3 space-y-1.5 text-sm" style={{ borderTop: '1px solid #F3F4F6' }}>
          <div className="flex justify-between" style={{ color: '#6B7280' }}><span>Subtotal</span><span>{formatINR(cart.subtotal)}</span></div>
          <div className="flex justify-between" style={{ color: '#6B7280' }}>
            <span>Shipping</span>
            <span>{shipping === 0 ? <span className="font-medium" style={{ color: '#166534' }}>FREE</span> : formatINR(shipping)}</span>
          </div>
          {shipping > 0 && (
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Add {formatINR(FREE_THRESHOLD - cart.subtotal)} more for free shipping</p>
          )}
          <div className="flex justify-between font-bold text-base pt-2" style={{ borderTop: '1px solid #F3F4F6', color: '#1F2937' }}>
            <span>Total</span><span>{formatINR(total)}</span>
          </div>
        </div>
      </section>

      <ErrorMessage message={orderErrorMsg} />

      <Button
        size="lg"
        className="w-full"
        disabled={!selectedAddressId}
        loading={placingOrder}
        onClick={handlePlaceOrder}
      >
        Place order · {formatINR(total)}
      </Button>
    </div>
    </AuthPageShell>
  );
}
