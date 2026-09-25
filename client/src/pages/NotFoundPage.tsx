import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center py-24">
      <h1 className="text-7xl font-bold" style={{ color: '#EDE7DC' }}>404</h1>
      <p className="text-xl mt-4" style={{ color: '#68736B' }}>Page not found</p>
      <p className="text-sm mt-2 mb-6" style={{ color: '#A8B5A0' }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm text-white shadow-sm"
        style={{ backgroundColor: '#0F5132' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0A3D26')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0F5132')}
      >
        ← Back to Home
      </Link>
    </div>
  );
}
