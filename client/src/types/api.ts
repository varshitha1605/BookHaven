// ─── Auth ────────────────────────────────────────────────────────────────────
export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserSummary;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ─── Category & Publisher ────────────────────────────────────────────────────
export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
}

export interface PublisherResponse {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
}

// ─── Books ───────────────────────────────────────────────────────────────────
export interface BookSummary {
  id: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  price: number;
  averageRating: number;
  reviewCount: number;
  stockQuantity: number;
  category: CategoryResponse | null;
  publisher: PublisherResponse | null;
}

// ─── Author ───────────────────────────────────────────────────────────────────
export interface AuthorResponse {
  id: string;
  name: string;
  bio: string | null;
  genre: string | null;
  famousWorks: string | null;
  photoUrl: string | null;
  bookCount: number;
}

export interface BookDetail extends BookSummary {
  isbn: string;
  description: string | null;
  pageCount: number | null;
  language: string | null;
  publishedDate: string | null;
  authorDetail: AuthorResponse | null;
  relatedBooks: BookSummary[];
}

export interface BookSearchParams {
  query?: string;
  categoryId?: string;
  publisherId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PageMetadata {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PagedResponse<T> {
  content: T[];
  pagination: PageMetadata;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItemResponse {
  id: string;
  book: BookSummary;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CartResponse {
  id: string;
  items: CartItemResponse[];
  itemCount: number;
  subtotal: number;
}

// ─── Address ─────────────────────────────────────────────────────────────────
export interface AddressResponse {
  id: string;
  recipientName: string | null;
  phoneNumber: string | null;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface AddressRequest {
  recipientName?: string;
  phoneNumber?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'STRIPE';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItemResponse {
  id: string;
  book: BookSummary;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  itemCount: number;
  placedAt: string;
  cancellableUntil: string | null;
}

export interface OrderDetail extends OrderSummary {
  items: OrderItemResponse[];
  shippingAddress: AddressResponse;
  cancelledAt: string | null;
  cancelReason: string | null;
}

export interface CheckoutRequest {
  addressId: string;
  paymentMethod: PaymentMethod;
  stripePaymentMethodId?: string;
}

export interface BuyAgainResponse {
  cart: CartResponse;
  skippedBooks: { bookId: string; title: string }[];
}

// ─── Error ────────────────────────────────────────────────────────────────────
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: Record<string, string>;
}
