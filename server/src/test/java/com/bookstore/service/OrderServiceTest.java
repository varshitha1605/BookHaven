package com.bookstore.service;

import com.bookstore.dto.request.CancelOrderRequest;
import com.bookstore.dto.request.CheckoutRequest;
import com.bookstore.dto.response.BuyAgainResponse;
import com.bookstore.dto.response.OrderDetailResponse;
import com.bookstore.dto.response.OrderSummaryResponse;
import com.bookstore.dto.response.PagedResponse;
import com.bookstore.entity.Address;
import com.bookstore.entity.Book;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository    orderRepository;
    @Mock private UserRepository     userRepository;
    @Mock private CartRepository     cartRepository;
    @Mock private AddressService     addressService;
    @Mock private CartService        cartService;
    @Mock private PaymentService     paymentService;

    @InjectMocks
    private OrderService orderService;

    private User    user;
    private Book    book;
    private Cart    cart;
    private CartItem cartItem;
    private Address address;
    private UUID    userId, bookId, addressId;

    @BeforeEach
    void setUp() {
        userId    = UUID.randomUUID();
        bookId    = UUID.randomUUID();
        addressId = UUID.randomUUID();

        user = User.builder().id(userId).email("jane@example.com").build();

        book = Book.builder()
                .id(bookId).title("Clean Code").author("Uncle Bob")
                .price(new BigDecimal("44.99")).stockQuantity(10)
                .build();

        cartItem = CartItem.builder()
                .id(UUID.randomUUID()).book(book).quantity(2).build();

        cart = Cart.builder()
                .id(UUID.randomUUID()).user(user)
                .items(new ArrayList<>(List.of(cartItem)))
                .build();

        address = Address.builder()
                .id(addressId).user(user)
                .label("Home").street("123 Main St").city("Springfield")
                .state("IL").postalCode("62701").country("US").isDefault(true)
                .build();
    }

    // ── placeOrder ────────────────────────────────────────────────────────────

    @Test
    void placeOrder_validCart_createsOrderAndClearsCart() {
        // Use qty=1 so subtotal=44.99 < FREE_SHIPPING_THRESHOLD(50.00) → shipping=4.99
        cartItem.setQuantity(1);

        CheckoutRequest req = new CheckoutRequest();
        req.setAddressId(addressId);
        req.setPaymentMethod(Order.PaymentMethod.PAYPAL);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(addressService.loadOwnedAddressForOrder("jane@example.com", addressId))
                .thenReturn(address);
        when(addressService.toResponse(address))
                .thenReturn(com.bookstore.dto.response.AddressResponse.builder()
                        .id(addressId).label("Home").build());
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);
        when(cartService.toBookSummary(book)).thenReturn(
                com.bookstore.dto.response.BookSummaryResponse.builder()
                        .id(bookId).title("Clean Code").build());

        OrderDetailResponse response = orderService.placeOrder("jane@example.com", req);

        assertThat(response.getStatus()).isEqualTo("CONFIRMED");
        assertThat(response.getPaymentStatus()).isEqualTo("PAID");
        assertThat(response.getSubtotal()).isEqualByComparingTo("44.99"); // 44.99 * 1
        assertThat(response.getShippingCost()).isEqualByComparingTo("4.99"); // subtotal < 50
        assertThat(cart.getItems()).isEmpty(); // cart cleared
        assertThat(book.getStockQuantity()).isEqualTo(9); // stock decremented by 1
    }

    @Test
    void placeOrder_freeShipping_whenSubtotalAboveThreshold() {
        book.setPrice(new BigDecimal("30.00"));
        cartItem.setQuantity(2); // subtotal = 60 >= 50 => free shipping

        CheckoutRequest req = new CheckoutRequest();
        req.setAddressId(addressId);
        req.setPaymentMethod(Order.PaymentMethod.PAYPAL);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(addressService.loadOwnedAddressForOrder("jane@example.com", addressId))
                .thenReturn(address);
        when(addressService.toResponse(address)).thenReturn(
                com.bookstore.dto.response.AddressResponse.builder().id(addressId).build());
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);
        when(cartService.toBookSummary(book)).thenReturn(
                com.bookstore.dto.response.BookSummaryResponse.builder().id(bookId).build());

        OrderDetailResponse response = orderService.placeOrder("jane@example.com", req);

        assertThat(response.getShippingCost()).isEqualByComparingTo("0.00");
    }

    @Test
    void placeOrder_emptyCart_throwsBadRequest() {
        cart.getItems().clear();
        CheckoutRequest req = new CheckoutRequest();
        req.setAddressId(addressId);
        req.setPaymentMethod(Order.PaymentMethod.PAYPAL);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));

        assertThatThrownBy(() -> orderService.placeOrder("jane@example.com", req))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("empty cart");
    }

    @Test
    void placeOrder_insufficientStock_throwsBeforePayment() {
        book.setStockQuantity(1); // cart has qty 2
        CheckoutRequest req = new CheckoutRequest();
        req.setAddressId(addressId);
        req.setPaymentMethod(Order.PaymentMethod.PAYPAL);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(addressService.loadOwnedAddressForOrder("jane@example.com", addressId))
                .thenReturn(address);

        assertThatThrownBy(() -> orderService.placeOrder("jane@example.com", req))
                .isInstanceOf(InsufficientStockException.class);

        // Payment must NOT have been attempted
        verify(paymentService, never()).charge(any(), any(), any());
    }

    @Test
    void placeOrder_creditCardPayment_chargesStripeAndSetsPaymentId() {
        CheckoutRequest req = new CheckoutRequest();
        req.setAddressId(addressId);
        req.setPaymentMethod(Order.PaymentMethod.CREDIT_CARD);
        req.setStripePaymentMethodId("pm_test_abc123");

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(addressService.loadOwnedAddressForOrder("jane@example.com", addressId))
                .thenReturn(address);
        when(addressService.toResponse(address)).thenReturn(
                com.bookstore.dto.response.AddressResponse.builder().id(addressId).build());
        // subtotal = 44.99 * 2 = 89.98 (>= $50 threshold) → free shipping → total = 89.98
        when(paymentService.charge("pm_test_abc123", new BigDecimal("89.98"), "usd"))
                .thenReturn("pi_mock_stripe_123");
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);
        when(cartService.toBookSummary(book)).thenReturn(
                com.bookstore.dto.response.BookSummaryResponse.builder().id(bookId).build());

        OrderDetailResponse response = orderService.placeOrder("jane@example.com", req);

        assertThat(response.getPaymentStatus()).isEqualTo("PAID");
        assertThat(response.getShippingCost()).isEqualByComparingTo("0.00"); // free shipping
        verify(paymentService).charge("pm_test_abc123", new BigDecimal("89.98"), "usd");
    }

    @Test
    void placeOrder_creditCardWithoutStripeToken_throwsBadRequest() {
        CheckoutRequest req = new CheckoutRequest();
        req.setAddressId(addressId);
        req.setPaymentMethod(Order.PaymentMethod.CREDIT_CARD);
        req.setStripePaymentMethodId(null); // missing token

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(addressService.loadOwnedAddressForOrder("jane@example.com", addressId))
                .thenReturn(address);

        assertThatThrownBy(() -> orderService.placeOrder("jane@example.com", req))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("stripePaymentMethodId");

        verify(paymentService, never()).charge(any(), any(), any());
    }

    // ── cancelOrder ───────────────────────────────────────────────────────────

    @Test
    void cancelOrder_pendingWithinWindow_cancelsAndRestoresStock() {
        Order order = buildOrder(Order.OrderStatus.CONFIRMED, Instant.now().minusSeconds(3600));

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findByIdAndUserId(order.getId(), userId))
                .thenReturn(Optional.of(order));
        when(addressService.toResponse(address)).thenReturn(
                com.bookstore.dto.response.AddressResponse.builder().id(addressId).build());
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(cartService.toBookSummary(book)).thenReturn(
                com.bookstore.dto.response.BookSummaryResponse.builder().id(bookId).build());

        CancelOrderRequest req = new CancelOrderRequest();
        req.setReason("Changed my mind");

        OrderDetailResponse response = orderService.cancelOrder("jane@example.com", order.getId(), req);

        assertThat(response.getStatus()).isEqualTo("CANCELLED");
        assertThat(response.getCancelReason()).isEqualTo("Changed my mind");
        assertThat(book.getStockQuantity()).isEqualTo(12); // 10 + 2 restored
    }

    @Test
    void cancelOrder_shippedOrder_throwsCancellationException() {
        Order order = buildOrder(Order.OrderStatus.SHIPPED, Instant.now().minusSeconds(3600));

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findByIdAndUserId(order.getId(), userId))
                .thenReturn(Optional.of(order));

        CancelOrderRequest req = new CancelOrderRequest();
        req.setReason("Too late");

        assertThatThrownBy(() -> orderService.cancelOrder("jane@example.com", order.getId(), req))
                .isInstanceOf(OrderCancellationException.class)
                .hasMessageContaining("SHIPPED");
    }

    @Test
    void cancelOrder_afterCancellationWindow_throws() {
        // placedAt is 50 hours ago — beyond the 48h window
        Order order = buildOrder(Order.OrderStatus.CONFIRMED,
                Instant.now().minus(50, ChronoUnit.HOURS));

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findByIdAndUserId(order.getId(), userId))
                .thenReturn(Optional.of(order));

        CancelOrderRequest req = new CancelOrderRequest();
        req.setReason("Late cancel");

        assertThatThrownBy(() -> orderService.cancelOrder("jane@example.com", order.getId(), req))
                .isInstanceOf(OrderCancellationException.class)
                .hasMessageContaining("expired");
    }

    @Test
    void cancelOrder_paidOrder_issuesRefund() {
        Order order = buildOrder(Order.OrderStatus.CONFIRMED, Instant.now().minusSeconds(3600));
        order.setPaymentStatus(Order.PaymentStatus.PAID);
        order.setStripePaymentId("pi_test_123");

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findByIdAndUserId(order.getId(), userId))
                .thenReturn(Optional.of(order));
        when(addressService.toResponse(address)).thenReturn(
                com.bookstore.dto.response.AddressResponse.builder().id(addressId).build());
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(cartService.toBookSummary(book)).thenReturn(
                com.bookstore.dto.response.BookSummaryResponse.builder().id(bookId).build());

        CancelOrderRequest req = new CancelOrderRequest();
        req.setReason("Refund test");

        OrderDetailResponse response = orderService.cancelOrder("jane@example.com", order.getId(), req);

        verify(paymentService).refund("pi_test_123");
        assertThat(response.getPaymentStatus()).isEqualTo("REFUNDED");
    }

    // ── listOrders ────────────────────────────────────────────────────────────

    @Test
    void listOrders_returnsPagedResults() {
        Order order = buildOrder(Order.OrderStatus.DELIVERED, Instant.now().minus(10, ChronoUnit.DAYS));
        Pageable pageable = PageRequest.of(0, 20);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findByUserIdOrderByPlacedAtDesc(userId, pageable))
                .thenReturn(new PageImpl<>(List.of(order), pageable, 1));

        PagedResponse<OrderSummaryResponse> response =
                orderService.listOrders("jane@example.com", pageable);

        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getContent().get(0).getStatus()).isEqualTo("DELIVERED");
        assertThat(response.getContent().get(0).getCancellableUntil()).isNull(); // DELIVERED
    }

    // ── buyAgain ──────────────────────────────────────────────────────────────

    @Test
    void buyAgain_allInStock_addsToCart() {
        Order order = buildOrder(Order.OrderStatus.DELIVERED, Instant.now().minus(5, ChronoUnit.DAYS));

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findByIdAndUserId(order.getId(), userId))
                .thenReturn(Optional.of(order));
        when(cartService.addToCart(eq(userId), any())).thenReturn(
                com.bookstore.dto.response.CartResponse.builder()
                        .id(UUID.randomUUID()).items(List.of()).itemCount(2)
                        .subtotal(new BigDecimal("89.98")).build());
        when(cartService.getCart(userId)).thenReturn(
                com.bookstore.dto.response.CartResponse.builder()
                        .id(UUID.randomUUID()).items(List.of()).itemCount(2)
                        .subtotal(new BigDecimal("89.98")).build());

        BuyAgainResponse response = orderService.buyAgain("jane@example.com", order.getId());

        assertThat(response.getSkippedBooks()).isEmpty();
        assertThat(response.getCart().getItemCount()).isEqualTo(2);
    }

    @Test
    void buyAgain_outOfStockBook_skipped() {
        book.setStockQuantity(0);
        Order order = buildOrder(Order.OrderStatus.DELIVERED, Instant.now().minus(5, ChronoUnit.DAYS));

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findByIdAndUserId(order.getId(), userId))
                .thenReturn(Optional.of(order));
        when(cartService.getCart(userId)).thenReturn(
                com.bookstore.dto.response.CartResponse.builder()
                        .id(UUID.randomUUID()).items(List.of()).itemCount(0)
                        .subtotal(BigDecimal.ZERO).build());

        BuyAgainResponse response = orderService.buyAgain("jane@example.com", order.getId());

        assertThat(response.getSkippedBooks()).hasSize(1);
        assertThat(response.getSkippedBooks().get(0).getTitle()).isEqualTo("Clean Code");
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Order buildOrder(Order.OrderStatus status, Instant placedAt) {
        OrderItem orderItem = OrderItem.builder()
                .id(UUID.randomUUID())
                .book(book)
                .quantity(2)
                .unitPrice(book.getPrice())
                .build();

        Order order = Order.builder()
                .id(UUID.randomUUID())
                .user(user)
                .address(address)
                .status(status)
                .paymentMethod(Order.PaymentMethod.PAYPAL)
                .paymentStatus(Order.PaymentStatus.PAID)
                .subtotal(new BigDecimal("89.98"))
                .shippingCost(new BigDecimal("4.99"))
                .total(new BigDecimal("94.97"))
                .items(new ArrayList<>(List.of(orderItem)))
                .build();

        // @CreationTimestamp fires on Hibernate flush; set directly for unit tests.
        // Order has @Setter at class level so setPlacedAt() is available.
        order.setPlacedAt(placedAt);

        orderItem.setOrder(order);
        return order;
    }
}
