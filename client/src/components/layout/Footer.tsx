import { Link } from 'react-router-dom';
import BookHavenLogo from '@/components/common/BookHavenLogo';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto" style={{ backgroundColor: '#2F3A31', color: '#E8E2D8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2">
            <BookHavenLogo variant="footer" className="mb-4" />
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#BAC8B5' }}>
              Your premier destination for books across every genre. Discover bestsellers, classics, and hidden gems — all priced in Indian Rupees.
            </p>

            {/* Contact info */}
            <div className="mt-4 space-y-1.5">
              <p className="text-xs flex items-center gap-2" style={{ color: '#BAC8B5' }}>
                <svg className="w-3.5 h-3.5 shrink-0" style={{ color: '#C9A96A' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@bookhaven.demo
              </p>
              <p className="text-xs flex items-center gap-2" style={{ color: '#BAC8B5' }}>
                <svg className="w-3.5 h-3.5 shrink-0" style={{ color: '#C9A96A' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mon–Sat, 9 am – 6 pm IST
              </p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A96A' }}>Shop</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/browse',                         label: 'All Books' },
                { to: '/browse?sort=averageRating,desc', label: 'Best Sellers' },
                { to: '/browse?sort=publishedDate,desc', label: 'New Arrivals' },
                { to: '/authors',                        label: 'Authors' },
                { to: '/wishlist',                       label: 'My Wishlist' },
                { to: '/support',                        label: 'Help & Support' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-sm transition-colors hover:text-white" style={{ color: '#BAC8B5' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A96A' }}>Account</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/login',           label: 'Login' },
                { to: '/register',        label: 'Register' },
                { to: '/profile',         label: 'My Profile' },
                { to: '/orders',          label: 'Order History' },
                { to: '/cart',            label: 'Shopping Cart' },
                { to: '/forgot-password', label: 'Reset Password' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-sm transition-colors hover:text-white" style={{ color: '#BAC8B5' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
          <p className="text-xs" style={{ color: '#8FA38A' }}>© {year} BookHaven. All rights reserved. Demo application.</p>
          <p className="text-xs" style={{ color: '#8FA38A' }}>Free shipping on orders over ₹4,000 · All prices in INR</p>
        </div>
      </div>
    </footer>
  );
}
