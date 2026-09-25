import { useState } from 'react';
import { useAppSelector } from '@/store';

const QUERY_CATEGORIES = [
  'Order status',
  'Delivery issue',
  'Payment issue',
  'Return or refund',
  'Book information',
  'Account issue',
  'Other',
];

const FAQS = [
  {
    q: 'How do I place an order?',
    a: 'Browse books, add them to your cart, sign in, then go to Checkout. Select a delivery address, choose a payment method, and click "Place order".',
  },
  {
    q: 'How do I check my order status?',
    a: 'Go to My Orders (top navigation → Orders). Click any order to see its current status: Pending, Confirmed, Shipped, Delivered, or Cancelled.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'Orders can be cancelled within 48 hours of placement, as long as the order status is Pending or Confirmed. Open the order details and click "Cancel order".',
  },
  {
    q: 'How do I add or update my delivery address?',
    a: 'You can add a new address during checkout. Click "+ Add a new address" and fill in your name, phone, and address details.',
  },
  {
    q: 'When is shipping free?',
    a: 'Shipping is free on orders with a subtotal of ₹4,000 or more. For orders below ₹4,000, a flat shipping fee of ₹199 applies.',
  },
  {
    q: 'How do I search for a book?',
    a: 'Use the search bar in the Browse page sidebar. You can search by title, author, or keyword and filter by category, publisher, price, and rating.',
  },
  {
    q: 'Are the book prices in Indian Rupees?',
    a: 'Yes. All prices shown throughout BookHaven are in Indian Rupees (₹).',
  },
  {
    q: 'How do I contact support?',
    a: 'Use the support form on this page. Fill in your name, email, query category, and message. Note: this is a demo application — submissions are not sent to a real support team.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #EDE7DC' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-white text-left gap-3 transition-colors"
        style={{ color: '#293B32' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F6F8F5')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
      >
        <span className="text-sm font-semibold" style={{ color: '#293B32' }}>{q}</span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          style={{ color: '#A8B5A0' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 py-3 text-sm leading-relaxed" style={{ borderTop: '1px solid #EDE7DC', color: '#68736B', backgroundColor: '#FDFCF8' }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  const { user } = useAppSelector((s) => s.auth);

  const [formState, setFormState] = useState({
    name: user ? `${user.firstName} ${user.lastName}`.trim() : '',
    email: user?.email ?? '',
    orderId: '',
    category: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!formState.name.trim()) e.name = 'Name is required';
    if (!formState.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) e.email = 'Enter a valid email address';
    if (!formState.category) e.category = 'Please select a query category';
    if (!formState.message.trim()) e.message = 'Please describe your query';
    else if (formState.message.trim().length < 10) e.message = 'Please provide more detail (at least 10 characters)';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  }

  function handleChange(field: string, value: string) {
    setFormState((s) => ({ ...s, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    border: `1px solid ${hasError ? '#C98268' : '#E8E2D8'}`,
    color: '#293B32',
    '--tw-ring-color': '#0F5132',
  } as React.CSSProperties);

  return (
    <div className="max-w-3xl mx-auto space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#293B32', fontFamily: 'Georgia, "Times New Roman", serif' }}>Help & Support</h1>
        <p className="text-sm mt-1" style={{ color: '#68736B' }}>Find answers to common questions or send us a message</p>
      </div>

      {/* FAQ */}
      <section>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#293B32' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: '#6B8F71' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {FAQS.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>
      </section>

      {/* Contact form */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-card" style={{ border: '1px solid #EDE7DC' }}>
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2" style={{ color: '#293B32' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: '#6B8F71' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact Support
        </h2>
        <p className="text-xs rounded-lg px-3 py-2 mb-5 leading-relaxed" style={{ color: '#A8883E', backgroundColor: '#FBF6EC', border: '1px solid #EBCEA1' }}>
          <strong>Demo notice:</strong> This is a learning/demo application. Submitting this form does not send a message to any real support team. The form validates and confirms submission locally only.
        </p>

        {submitted ? (
          <div className="rounded-xl p-5 text-center space-y-2" style={{ backgroundColor: '#F0F7F1', border: '1px solid #D6EDD9' }}>
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: '#5A7A5E' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold" style={{ color: '#486250' }}>Query submitted!</p>
            <p className="text-sm" style={{ color: '#5A7A5E' }}>
              Thank you, <strong>{formState.name}</strong>. We've received your query about "<strong>{formState.category}</strong>". In a real application, our support team would respond to <strong>{formState.email}</strong> within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => { setSubmitted(false); setFormState({ name: user ? `${user.firstName} ${user.lastName}`.trim() : '', email: user?.email ?? '', orderId: '', category: '', message: '' }); }}
              className="text-sm hover:underline mt-1"
              style={{ color: '#5A7A5E' }}
            >
              Submit another query
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#68736B' }}>Full Name *</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={inputStyle(!!errors.name)}
                />
                {errors.name && <p className="text-xs mt-1" style={{ color: '#C98268' }}>{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#68736B' }}>Email Address *</label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={inputStyle(!!errors.email)}
                />
                {errors.email && <p className="text-xs mt-1" style={{ color: '#C98268' }}>{errors.email}</p>}
              </div>
            </div>

            {/* Category + Order ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#68736B' }}>Query Category *</label>
                <select
                  value={formState.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 bg-white transition-all appearance-none cursor-pointer"
                  style={inputStyle(!!errors.category)}
                >
                  <option value="">Select a category</option>
                  {QUERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-xs mt-1" style={{ color: '#C98268' }}>{errors.category}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#68736B' }}>Order ID <span className="font-normal" style={{ color: '#A8B5A0' }}>(optional)</span></label>
                <input
                  type="text"
                  value={formState.orderId}
                  onChange={(e) => handleChange('orderId', e.target.value)}
                  placeholder="e.g. from My Orders page"
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ border: '1px solid #E8E2D8', color: '#293B32', '--tw-ring-color': '#0F5132' } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#68736B' }}>Your Message *</label>
              <textarea
                value={formState.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Please describe your issue or question in detail..."
                rows={5}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none transition-all"
                style={inputStyle(!!errors.message)}
              />
              {errors.message && <p className="text-xs mt-1" style={{ color: '#C98268' }}>{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto text-white font-semibold px-8 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
              style={{ backgroundColor: '#0F5132' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0A3D26')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0F5132')}
            >
              Submit Query
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
