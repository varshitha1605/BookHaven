/**
 * AuthNavbar — minimal header shown only on Login and Register pages.
 *
 * Contains:
 *   • BookHaven logo/branding (links to "/")
 *   • "Back to Store" link on the right
 *
 * Everything else (search, nav links, cart, wishlist, auth buttons) is
 * intentionally absent so the page stays focused on authentication.
 */

import { Link, useLocation } from 'react-router-dom';
import BookHavenLogo from '@/components/common/BookHavenLogo';

export default function AuthNavbar() {
  const { pathname } = useLocation();

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: '#FDFCF8', borderColor: '#E8E2D8' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <BookHavenLogo variant="navbar" />

          {/* Right side — context-aware auth link + Back to Store */}
          <div className="flex items-center gap-3">
            {pathname === '/login' ? (
              <Link
                to="/register"
                className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-1"
                style={{ color: '#293B32' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#EBF0E9')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Register
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-1"
                style={{ color: '#293B32' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#EBF0E9')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Login
              </Link>
            )}

            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-1.5 rounded-lg transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5132] focus-visible:ring-offset-1"
              style={{ backgroundColor: '#0F5132' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0A3D26')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0F5132')}
            >
              {/* Left-arrow icon */}
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
