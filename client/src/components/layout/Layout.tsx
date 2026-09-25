import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import AuthNavbar from './AuthNavbar';
import Footer from './Footer';
import SupportWidget from '@/components/common/SupportWidget';

const AUTH_PATHS = ['/login', '/register'];

// Pages that use AuthPageShell — need a full-bleed, unpadded main area
// so the background image fills edge-to-edge.
const COZY_PATHS = ['/login', '/register', '/checkout', '/wishlist', '/cart'];
function isCozyPath(pathname: string) {
  return COZY_PATHS.includes(pathname) || /^\/orders\/[^/]+/.test(pathname);
}

export default function Layout() {
  const { pathname } = useLocation();
  const isAuthPage  = AUTH_PATHS.includes(pathname);
  const isFullBleed = isCozyPath(pathname);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F0' }}>
      {isAuthPage ? <AuthNavbar /> : <Navbar />}
      {isFullBleed ? (
        // Full-bleed: no max-width, no padding — AuthPageShell handles its own layout
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      )}
      <Footer />
      {!isAuthPage && <SupportWidget />}
    </div>
  );
}
