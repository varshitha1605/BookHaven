# Bookstore E-Commerce Application

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 17 + Spring Boot 3.2 |
| **Database** | PostgreSQL 16 · Flyway migrations |
| **Auth** | Spring Security + JWT (jjwt 0.11.5) |
| **API Docs** | SpringDoc OpenAPI 3 (Swagger UI) |
| **Payments** | Stripe SDK (test/mock mode) |
| **Frontend** | React 18 + TypeScript + Tailwind CSS |
| **State** | Redux Toolkit + RTK Query |
| **Routing** | React Router v6 |
| **Forms** | React Hook Form + Zod |

---

## Project Structure

```
bookstore/
├── openapi/
│   └── bookstore-api.yaml          # OpenAPI 3 specification (source of truth)
├── server/                          # Spring Boot backend
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/bookstore/
│       │   ├── config/              # SecurityConfig, WebConfig (CORS), OpenApiConfig
│       │   ├── controller/          # AuthController, BookController, CategoryController,
│       │   │                        # PublisherController, CartController,
│       │   │                        # AddressController, OrderController
│       │   ├── service/             # AuthService, BookService, CartService,
│       │   │                        # AddressService, OrderService, PaymentService,
│       │   │                        # CategoryService, PublisherService, UserResolverService
│       │   ├── repository/          # 7 Spring Data JPA repositories + BookSpecifications
│       │   ├── entity/              # User, Book, Category, Publisher, Cart, CartItem,
│       │   │                        # Order, OrderItem, Address
│       │   ├── dto/request/         # LoginRequest, RegisterRequest, CartItemRequest,
│       │   │                        # CheckoutRequest, AddressRequest, CancelOrderRequest,
│       │   │                        # MergeCartRequest, RefreshTokenRequest, UpdateCartItemRequest
│       │   ├── dto/response/        # AuthResponse, BookDetailResponse, BookSummaryResponse,
│       │   │                        # CartResponse, CartItemResponse, OrderDetailResponse,
│       │   │                        # OrderSummaryResponse, OrderItemResponse, AddressResponse,
│       │   │                        # BuyAgainResponse, CategoryResponse, PublisherResponse,
│       │   │                        # PagedResponse, UserSummaryResponse
│       │   ├── security/            # JwtTokenProvider, JwtAuthFilter, UserDetailsServiceImpl
│       │   └── exception/           # GlobalExceptionHandler + 5 domain exceptions
│       ├── main/resources/
│       │   ├── application.yml
│       │   └── db/migration/        # V1–V6 Flyway (schema + 20 seed books)
│       └── test/java/com/bookstore/
│           └── service/             # AuthServiceTest, BookServiceTest, CartServiceTest,
│                                    # AddressServiceTest, OrderServiceTest (50+ tests total)
├── client/                          # React 18 + TypeScript frontend
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── src/
│       ├── types/api.ts             # All TypeScript types from OpenAPI spec
│       ├── lib/api.ts               # Fetch wrapper with silent JWT refresh
│       ├── store/                   # Redux store, authSlice, cartSlice, RTK Query APIs
│       ├── components/              # BookCard, BookFilters, OrderStatusBadge,
│       │   layout/                  # Navbar, Layout, Footer, ProtectedRoute
│       │   common/                  # Button, Input, Spinner, StarRating,
│       │                            # CartIcon, ErrorMessage, Pagination
│       ├── pages/                   # HomePage, BrowsePage, BookDetailPage,
│       │                            # LoginPage, RegisterPage, CartPage,
│       │                            # CheckoutPage, OrderHistoryPage,
│       │                            # OrderDetailPage, NotFoundPage
│       └── test/                    # 19 unit tests (authSlice, cartSlice, components)
└── docker-compose.yml               # PostgreSQL 16 dev + test containers
```

---

## Quick Start

### Prerequisites
- Java 17+, Maven 3.9+
- Node.js 20+, npm 10+
- Docker & Docker Compose

### 1. Start PostgreSQL

```bash
docker-compose up -d postgres
```

### 2. Run the backend

```bash
cd server
mvn spring-boot:run
# API available at http://localhost:8080/api
# Swagger UI at  http://localhost:8080/api/swagger-ui.html
```

### 3. Run the frontend

```bash
cd client
npm install
npm run dev
# App available at http://localhost:5173
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/bookstore` | PostgreSQL JDBC URL |
| `DB_USERNAME` | `bookstore` | Database username |
| `DB_PASSWORD` | `bookstore` | Database password |
| `JWT_SECRET` | *(change in production)* | HMAC-SHA256 signing key (≥32 chars) |
| `JWT_EXPIRY_MS` | `900000` | Access token TTL (15 min) |
| `JWT_REFRESH_EXPIRY_MS` | `604800000` | Refresh token TTL (7 days) |
| `CORS_ORIGINS` | `http://localhost:5173` | Allowed CORS origins |
| `STRIPE_SECRET_KEY` | `sk_test_placeholder` | Stripe test secret key |

---

## Seed Accounts

| Role | Email | Password |
|---|---|---|
| `ADMIN` | `admin@bookstore.com` | `Password1!` |
| `USER` | `jane.doe@example.com` | `Password1!` |

---

## Running Tests

```bash
# Backend tests (requires Java 17 + Maven)
cd server
mvn test

# Frontend tests (requires Node 20+)
cd client
npm install
npm test -- --run
```

---

## Implementation Phases

| Phase | Status | Description |
|---|---|---|
| 1A | ✅ Done | OpenAPI 3 specification — full contract, all endpoints, schemas, security |
| 1B | ✅ Done | Spring Boot scaffold, all 9 entities, 7 repositories, Flyway V1–V6, 20 seed books |
| 2  | ✅ Done | Auth: register, login, refresh token, JWT filter, cart-merge on login |
| 3  | ✅ Done | Books, categories, publishers: search, filter, paging, detail, related books |
| 4  | ✅ Done | Cart (add/update/remove/clear) + Address CRUD + unit tests |
| 5  | ✅ Done | Orders: checkout, payment, history, detail, cancel (48h), buy again |
| 6  | ✅ Done | React frontend: all pages, Redux store, RTK Query, 19 unit tests |
| 6F | ✅ Done | Final review, README update, walkthrough artifact |
