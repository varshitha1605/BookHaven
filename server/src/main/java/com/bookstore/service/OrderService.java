package com.bookstore.service;

import com.bookstore.dto.request.CancelOrderRequest;
import com.bookstore.dto.request.CheckoutRequest;
import com.bookstore.dto.response.BuyAgainResponse;
import com.bookstore.dto.response.OrderDetailResponse;
import com.bookstore.dto.response.OrderItemResponse;
import com.bookstore.dto.response.OrderSummaryResponse;
import com.bookstore.dto.response.PagedResponse;
import com.bookstore.entity.Address;
import com.bookstore.entity.Cart;
import com.bookstore.entity.CartItem;
import com.bookstore.entity.Order;
import com.bookstore.entity.OrderItem;
import com.bookstore.entity.User;
import com.bookstore.exception.InsufficientStockException;
import com.bookstore.exception.OrderCancellationException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private static final BigDecimal SHIPPING_COST    = new BigDecimal("4.99");
    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("50.00");
    private static final long       CANCEL_WINDOW_HOURS = 48L;

    private final OrderRepository    orderRepository;
    private final UserRepository     userRepository;
    private final CartRepository     cartRepository;
    private final AddressService     addressService;
    private final CartService        cartService;
    private final PaymentService     paymentService;

    // ── Place order (checkout) ────────────────────────────────────────────────

    @Transactional
    public OrderDetailResponse placeOrder(String email, CheckoutRequest request) {
        User user = loadUser(email);

        // 1. Validate the cart is non-empty
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", user.getId()));
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot place an order with an empty cart");
        }

        // 2. Validate the shipping address is owned by this user
        Address address = addressService.loadOwnedAddressForOrder(email, request.getAddressId());

        // 3. Reserve stock — validate all items before touching the DB
        for (CartItem cartItem : cart.getItems()) {
            int available = cartItem.getBook().getStockQuantity();
            if (available < cartItem.getQuantity()) {
                throw new InsufficientStockException(
                        cartItem.getBook().getTitle(), cartItem.getQuantity(), available);
            }
        }

        // 4. Calculate totals
        BigDecimal subtotal = cart.getItems().stream()
                .map(i -> i.getBook().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shippingCost = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0
                ? BigDecimal.ZERO : SHIPPING_COST;
        BigDecimal total = subtotal.add(shippingCost);

        // 5. Process payment
        String stripePaymentId = null;
        Order.PaymentStatus paymentStatus = Order.PaymentStatus.PENDING;

        if (request.getPaymentMethod() == Order.PaymentMethod.CREDIT_CARD
                || request.getPaymentMethod() == Order.PaymentMethod.DEBIT_CARD) {
            if (request.getStripePaymentMethodId() == null
                    || request.getStripePaymentMethodId().isBlank()) {
                throw new IllegalStateException(
                        "stripePaymentMethodId is required for CREDIT_CARD and DEBIT_CARD payments");
            }
            stripePaymentId = paymentService.charge(
                    request.getStripePaymentMethodId(), total, "usd");
            paymentStatus = Order.PaymentStatus.PAID;
        } else {
            // PAYPAL / STRIPE token flows — mark PAID immediately for mock
            paymentStatus = Order.PaymentStatus.PAID;
        }

        // 6. Build the Order entity
        // placedAt is set explicitly so computeCancellableUntil() has a non-null value
        // when called on the in-memory object returned by the mocked save() in tests.
        // @CreationTimestamp will overwrite this with the DB server time on persist,
        // so production behaviour is unchanged.
        Order order = Order.builder()
                .user(user)
                .address(address)
                .status(Order.OrderStatus.CONFIRMED)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(paymentStatus)
                .stripePaymentId(stripePaymentId)
                .subtotal(subtotal)
                .shippingCost(shippingCost)
                .total(total)
                .placedAt(Instant.now())
                .build();

        // 7. Convert cart items → order items, decrement stock
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            orderItems.add(OrderItem.builder()
                    .order(order)
                    .book(cartItem.getBook())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getBook().getPrice())
                    .build());

            // Decrement stock
            cartItem.getBook().setStockQuantity(
                    cartItem.getBook().getStockQuantity() - cartItem.getQuantity());
        }
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // 8. Clear the cart
        cart.getItems().clear();
        cartRepository.save(cart);

        log.info("Order placed: orderId={} userId={} total={}", savedOrder.getId(), user.getId(), total);
        return toOrderDetail(savedOrder);
    }

    // ── Order history ─────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public PagedResponse<OrderSummaryResponse> listOrders(String email, Pageable pageable) {
        User user = loadUser(email);
        Page<Order> page = orderRepository.findByUserIdOrderByPlacedAtDesc(user.getId(), pageable);

        List<OrderSummaryResponse> content = page.getContent().stream()
                .map(this::toOrderSummary)
                .toList();

        return PagedResponse.<OrderSummaryResponse>builder()
                .content(content)
                .pagination(PagedResponse.PageMetadata.builder()
                        .page(page.getNumber())
                        .size(page.getSize())
                        .totalElements(page.getTotalElements())
                        .totalPages(page.getTotalPages())
                        .build())
                .build();
    }

    // ── Order detail ──────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public OrderDetailResponse getOrder(String email, UUID orderId) {
        User user = loadUser(email);
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        return toOrderDetail(order);
    }

    // ── Cancel order ──────────────────────────────────────────────────────────

    @Transactional
    public OrderDetailResponse cancelOrder(String email, UUID orderId, CancelOrderRequest request) {
        User user = loadUser(email);
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // Guard: only PENDING or CONFIRMED orders can be cancelled
        if (order.getStatus() == Order.OrderStatus.SHIPPED
                || order.getStatus() == Order.OrderStatus.DELIVERED
                || order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new OrderCancellationException(
                    "Order cannot be cancelled — status is " + order.getStatus());
        }

        // Guard: 48-hour window (clock starts at placedAt)
        Instant cutoff = order.getPlacedAt().plus(CANCEL_WINDOW_HOURS, ChronoUnit.HOURS);
        if (Instant.now().isAfter(cutoff)) {
            throw new OrderCancellationException(
                    "Cancellation window has expired (48 hours from order placement)");
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            item.getBook().setStockQuantity(
                    item.getBook().getStockQuantity() + item.getQuantity());
        }

        // Refund if payment was captured
        if (order.getPaymentStatus() == Order.PaymentStatus.PAID
                && order.getStripePaymentId() != null) {
            paymentService.refund(order.getStripePaymentId());
            order.setPaymentStatus(Order.PaymentStatus.REFUNDED);
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setCancelledAt(Instant.now());
        order.setCancelReason(request.getReason());

        Order saved = orderRepository.save(order);
        log.info("Order cancelled: orderId={} reason={}", orderId, request.getReason());
        return toOrderDetail(saved);
    }

    // ── Buy Again ─────────────────────────────────────────────────────────────

    @Transactional
    public BuyAgainResponse buyAgain(String email, UUID orderId) {
        User user = loadUser(email);
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        List<BuyAgainResponse.SkippedBook> skipped = new ArrayList<>();

        for (OrderItem item : order.getItems()) {
            if (item.getBook().getStockQuantity() <= 0) {
                skipped.add(BuyAgainResponse.SkippedBook.builder()
                        .bookId(item.getBook().getId())
                        .title(item.getBook().getTitle())
                        .build());
                continue;
            }
            // Re-use CartService.addToCart for stock validation and quantity summing
            com.bookstore.dto.request.CartItemRequest cartRequest =
                    new com.bookstore.dto.request.CartItemRequest();
            cartRequest.setBookId(item.getBook().getId());
            cartRequest.setQuantity(item.getQuantity());

            try {
                cartService.addToCart(user.getId(), cartRequest);
            } catch (InsufficientStockException e) {
                // Partial stock — addToCart throws; skip this book
                skipped.add(BuyAgainResponse.SkippedBook.builder()
                        .bookId(item.getBook().getId())
                        .title(item.getBook().getTitle())
                        .build());
            }
        }

        return BuyAgainResponse.builder()
                .cart(cartService.getCart(user.getId()))
                .skippedBooks(skipped)
                .build();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private User loadUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private Instant computeCancellableUntil(Order order) {
        if (order.getStatus() == Order.OrderStatus.CANCELLED
                || order.getStatus() == Order.OrderStatus.DELIVERED) {
            return null;
        }
        return order.getPlacedAt().plus(CANCEL_WINDOW_HOURS, ChronoUnit.HOURS);
    }

    // ── Mapping ───────────────────────────────────────────────────────────────

    public OrderSummaryResponse toOrderSummary(Order order) {
        return OrderSummaryResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .paymentMethod(order.getPaymentMethod().name())
                .paymentStatus(order.getPaymentStatus().name())
                .subtotal(order.getSubtotal())
                .shippingCost(order.getShippingCost())
                .total(order.getTotal())
                .itemCount(order.getItems().stream()
                        .mapToInt(OrderItem::getQuantity).sum())
                .placedAt(order.getPlacedAt())
                .cancellableUntil(computeCancellableUntil(order))
                .build();
    }

    public OrderDetailResponse toOrderDetail(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(this::toOrderItemResponse)
                .toList();

        return OrderDetailResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .paymentMethod(order.getPaymentMethod().name())
                .paymentStatus(order.getPaymentStatus().name())
                .subtotal(order.getSubtotal())
                .shippingCost(order.getShippingCost())
                .total(order.getTotal())
                .itemCount(itemResponses.stream().mapToInt(OrderItemResponse::getQuantity).sum())
                .placedAt(order.getPlacedAt())
                .cancellableUntil(computeCancellableUntil(order))
                .items(itemResponses)
                .shippingAddress(addressService.toResponse(order.getAddress()))
                .cancelledAt(order.getCancelledAt())
                .cancelReason(order.getCancelReason())
                .build();
    }

    private OrderItemResponse toOrderItemResponse(OrderItem item) {
        BigDecimal lineTotal = item.getUnitPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));
        return OrderItemResponse.builder()
                .id(item.getId())
                .book(cartService.toBookSummary(item.getBook()))
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .lineTotal(lineTotal)
                .build();
    }
}
