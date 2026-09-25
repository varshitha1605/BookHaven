import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/authSlice';
import { useGetCartQuery } from '@/store/api/cartApi';
import BookHavenLogo from '@/components/common/BookHavenLogo';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const guestItems = useAppSelector((s) => s.guestCart.items);
  const { data: serverCart } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const wishlistCount = useAppSelector((s) => s.wishlist.items.length);

  const cartCount = isAuthenticated
    ? (serverCart?.itemCount ?? 0)
    : guestItems.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleLogout() {
    dispatch(logout());
    setMenuOpen(false);
    setProfileOpen(false);
    navigate('/');
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  }

  // Primary dark green for active nav items
  const activeStyle = { color: '#0F5132' };

  return (
    <header className="sticky top-0 z-50 border-b shadow-nav" style={{ backgroundColor: '#FDFCF8', borderColor: '#E8E2D8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* ── Brand / Logo ─────────────────────────── */}
          <BookHavenLogo variant="navbar" />

          {/* ── Desktop nav ──────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-6">
            {[
              { to: '/browse',                         label: 'Categories' },
              { to: '/browse?sort=publishedDate,desc', label: 'New Arrivals' },
              { to: '/browse?sort=averageRating,desc', label: 'Best Sellers' },
              { to: '/authors',                        label: 'Authors' },
            ].map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'font-semibold' : 'hover:text-[#0F5132]'}`
              }
              style={({ isActive }) => isActive ? activeStyle : { color: '#293B32' }}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── Search bar (desktop) ──────────────────── */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm items-center" role="search">
            <div className="relative w-full">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#A8B5A0' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors…"
                aria-label="Search books and authors"
                className="w-full pl-10 pr-4 py-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ border: '1px solid #DDD7CD', backgroundColor: '#FFFFFF', color: '#293B32', '--tw-ring-color': '#0F5132' } as React.CSSProperties}
              />
            </div>
          </form>

          {/* ── Right side ──────────────────────────── */}
          <div className="flex items-center gap-1">

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-1"
              style={{ color: '#68736B' }}
              aria-label={`Wishlist (${wishlistCount} items)`}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#EBF0E9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none" aria-hidden="true" style={{ backgroundColor: '#C98268' }}>
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-1"
              style={{ color: '#68736B' }}
              aria-label={`Cart (${cartCount} items)`}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#EBF0E9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none" aria-hidden="true" style={{ backgroundColor: '#0F5132' }}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth — desktop */}
            <div className="hidden md:flex items-center gap-1.5 ml-1">
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-1"
                    style={{ color: '#293B32' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#EBF0E9')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    aria-label="Profile menu"
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs uppercase" style={{ backgroundColor: '#0F5132' }}>
                      {user?.firstName?.[0] ?? 'U'}
                    </div>
                    <span className="text-sm font-medium max-w-[72px] truncate" style={{ color: '#293B32' }}>{user?.firstName}</span>
                    <svg className={`w-3.5 h-3.5 transition-transform ${profileOpen ? 'rotate-180' : ''}`} style={{ color: '#A8B5A0' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl shadow-lg py-1 z-50" role="menu" aria-label="Profile menu" style={{ backgroundColor: '#FDFCF8', border: '1px solid #E8E2D8' }}>
                      <div className="px-3 py-2" style={{ borderBottom: '1px solid #F0EBE3' }}>
                        <p className="text-xs font-semibold truncate" style={{ color: '#293B32' }}>{user?.firstName} {user?.lastName}</p>
                        <p className="text-[11px] truncate" style={{ color: '#A8B5A0' }}>{user?.email}</p>
                      </div>
                      {[
                        { to: '/profile',  label: 'My Profile',  icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                        { to: '/orders',   label: 'My Orders',   icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10' },
                        { to: '/wishlist', label: 'My Wishlist', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
                      ].map(({ to, label, icon }) => (
                        <Link key={to} to={to} onClick={() => setProfileOpen(false)}
                          role="menuitem"
                          className="flex items-center gap-2 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:bg-[#EBF0E9] focus-visible:text-[#0F5132]"
                          style={{ color: '#293B32' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EBF0E9'; e.currentTarget.style.color = '#0F5132'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#293B32'; }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                          </svg>
                          {label}
                        </Link>
                      ))}
                      <div className="mt-1" style={{ borderTop: '1px solid #F0EBE3' }}>
                        <button
                          onClick={handleLogout}
                          role="menuitem"
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 focus-visible:outline-none focus-visible:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-1"
                    style={{ color: '#293B32' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#EBF0E9')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-semibold text-white px-4 py-1.5 rounded-lg transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-1"
                    style={{ backgroundColor: '#0F5132' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0A3D26')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0F5132')}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-1"
              style={{ color: '#293B32' }}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div id="mobile-menu" className="md:hidden py-3 space-y-1" style={{ borderTop: '1px solid #E8E2D8' }}>
            <form onSubmit={handleSearch} className="px-1 pb-2" role="search">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A8B5A0' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books…"
                  aria-label="Search books and authors"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2"
                  style={{ border: '1px solid #E8E2D8', backgroundColor: '#F6F4EF', '--tw-ring-color': '#0F5132' } as React.CSSProperties}
                />
              </div>
            </form>
            {[
              { to: '/browse',                         label: 'Categories' },
              { to: '/browse?sort=publishedDate,desc', label: 'New Arrivals' },
              { to: '/browse?sort=averageRating,desc', label: 'Best Sellers' },
              { to: '/authors',                        label: 'Authors' },
              { to: '/wishlist', label: `Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ''}` },
              { to: '/cart', label: `Cart${cartCount > 0 ? ` (${cartCount})` : ''}` },
            ].map(({ to, label }) => (
              <MobileLink key={to} to={to} onClick={() => setMenuOpen(false)}>{label}</MobileLink>
            ))}
            {isAuthenticated ? (
              <>
                <MobileLink to="/profile" onClick={() => setMenuOpen(false)}>My Profile</MobileLink>
                <MobileLink to="/orders"  onClick={() => setMenuOpen(false)}>My Orders</MobileLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:bg-red-50 rounded-lg transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <MobileLink to="/login"    onClick={() => setMenuOpen(false)}>Login</MobileLink>
                <MobileLink to="/register" onClick={() => setMenuOpen(false)}>Register</MobileLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function MobileLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-1 ${
          isActive ? 'font-semibold' : 'hover:bg-gray-50'
        }`
      }
      style={({ isActive }) => isActive
        ? { backgroundColor: '#EBF0E9', color: '#0F5132' }
        : { color: '#293B32' }}
    >
      {children}
    </NavLink>
  );
}
