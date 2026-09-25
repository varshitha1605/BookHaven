import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import BrowsePage from '@/pages/BrowsePage';
import BookDetailPage from '@/pages/BookDetailPage';
import AuthorsPage from '@/pages/AuthorsPage';
import AuthorPage from '@/pages/AuthorPage';
import ProfilePage from '@/pages/ProfilePage';
import SupportPage from '@/pages/SupportPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderHistoryPage from '@/pages/OrderHistoryPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';
import WishlistPage from '@/pages/WishlistPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/authors" element={<AuthorsPage />} />
        <Route path="/authors/:id" element={<AuthorPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/orders/:id/success" element={<OrderSuccessPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
