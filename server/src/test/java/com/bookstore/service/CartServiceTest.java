package com.bookstore.service;

import com.bookstore.dto.request.CartItemRequest;
import com.bookstore.dto.response.CartResponse;
import com.bookstore.entity.Book;
import com.bookstore.entity.Cart;
import com.bookstore.entity.CartItem;
import com.bookstore.entity.User;
import com.bookstore.exception.InsufficientStockException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock private CartRepository cartRepository;
    @Mock private BookRepository bookRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Book book;
    private Cart cart;
    private UUID userId;
    private UUID bookId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        bookId = UUID.randomUUID();

        user = User.builder().id(userId).email("jane@example.com").build();

        book = Book.builder()
                .id(bookId)
                .title("Clean Code")
                .author("Robert C. Martin")
                .price(new BigDecimal("44.99"))
                .stockQuantity(10)
                .build();

        cart = Cart.builder()
                .id(UUID.randomUUID())
                .user(user)
                .items(new ArrayList<>())
                .build();
    }

    @Test
    void addToCart_newItem_addsSuccessfully() {
        CartItemRequest request = new CartItemRequest();
        request.setBookId(bookId);
        request.setQuantity(2);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        CartResponse response = cartService.addToCart(userId, request);

        assertThat(cart.getItems()).hasSize(1);
        assertThat(cart.getItems().get(0).getQuantity()).isEqualTo(2);
    }

    @Test
    void addToCart_existingItem_sumsQuantity() {
        CartItem existing = CartItem.builder()
                .id(UUID.randomUUID()).cart(cart).book(book).quantity(3).build();
        cart.getItems().add(existing);

        CartItemRequest request = new CartItemRequest();
        request.setBookId(bookId);
        request.setQuantity(4);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        cartService.addToCart(userId, request);

        assertThat(existing.getQuantity()).isEqualTo(7);
    }

    @Test
    void addToCart_insufficientStock_throws() {
        CartItemRequest request = new CartItemRequest();
        request.setBookId(bookId);
        request.setQuantity(99); // stock is 10

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));

        assertThatThrownBy(() -> cartService.addToCart(userId, request))
                .isInstanceOf(InsufficientStockException.class)
                .hasMessageContaining("Clean Code");
    }

    @Test
    void addToCart_bookNotFound_throws() {
        CartItemRequest request = new CartItemRequest();
        request.setBookId(bookId);
        request.setQuantity(1);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(bookRepository.findById(bookId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.addToCart(userId, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Book");
    }

    @Test
    void removeItem_existingItem_removesFromCart() {
        UUID itemId = UUID.randomUUID();
        CartItem item = CartItem.builder()
                .id(itemId).cart(cart).book(book).quantity(2).build();
        cart.getItems().add(item);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        cartService.removeItem(userId, itemId);

        assertThat(cart.getItems()).isEmpty();
    }

    @Test
    void removeItem_notFound_throws() {
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));

        assertThatThrownBy(() -> cartService.removeItem(userId, UUID.randomUUID()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("CartItem");
    }

    @Test
    void updateItem_validQuantity_updatesQuantity() {
        UUID itemId = UUID.randomUUID();
        CartItem item = CartItem.builder()
                .id(itemId).cart(cart).book(book).quantity(2).build();
        cart.getItems().add(item);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        cartService.updateItem(userId, itemId, 5);

        assertThat(item.getQuantity()).isEqualTo(5);
    }

    @Test
    void updateItem_exceedsStock_throws() {
        UUID itemId = UUID.randomUUID();
        CartItem item = CartItem.builder()
                .id(itemId).cart(cart).book(book).quantity(2).build();
        cart.getItems().add(item);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));

        assertThatThrownBy(() -> cartService.updateItem(userId, itemId, 100))
                .isInstanceOf(InsufficientStockException.class);
    }

    @Test
    void clearCart_removesAllItems() {
        cart.getItems().add(CartItem.builder()
                .id(UUID.randomUUID()).cart(cart).book(book).quantity(1).build());
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        cartService.clearCart(userId);

        assertThat(cart.getItems()).isEmpty();
    }

    @Test
    void mergeGuestCart_outOfStockBook_isSkipped() {
        Book outOfStock = Book.builder()
                .id(UUID.randomUUID()).title("OOS Book")
                .price(new BigDecimal("9.99")).stockQuantity(0).build();

        CartItemRequest guestItem = new CartItemRequest();
        guestItem.setBookId(outOfStock.getId());
        guestItem.setQuantity(1);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(bookRepository.findById(outOfStock.getId())).thenReturn(Optional.of(outOfStock));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        CartResponse response = cartService.mergeGuestCart(user, java.util.List.of(guestItem));

        assertThat(cart.getItems()).isEmpty();
    }

    @Test
    void mergeGuestCart_combinesQuantitiesCappedAtStock() {
        CartItem existing = CartItem.builder()
                .id(UUID.randomUUID()).cart(cart).book(book).quantity(8).build();
        cart.getItems().add(existing);

        CartItemRequest guestItem = new CartItemRequest();
        guestItem.setBookId(bookId);
        guestItem.setQuantity(5); // 8 + 5 = 13, but stock is 10 → should cap at 10

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        cartService.mergeGuestCart(user, java.util.List.of(guestItem));

        assertThat(existing.getQuantity()).isEqualTo(10); // capped at stock
    }
}
