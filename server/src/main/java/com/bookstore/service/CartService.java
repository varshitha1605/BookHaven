package com.bookstore.service;

import com.bookstore.dto.request.CartItemRequest;
import com.bookstore.dto.response.BookSummaryResponse;
import com.bookstore.dto.response.CartItemResponse;
import com.bookstore.dto.response.CartResponse;
import com.bookstore.dto.response.CategoryResponse;
import com.bookstore.dto.response.PublisherResponse;
import com.bookstore.entity.Book;
import com.bookstore.entity.Cart;
import com.bookstore.entity.CartItem;
import com.bookstore.entity.User;
import com.bookstore.exception.InsufficientStockException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    // ── Cart retrieval ────────────────────────────────────────────────────────

    @Transactional
    public CartResponse getCart(UUID userId) {
        Cart cart = getOrCreateCart(userId);
        return toCartResponse(cart);
    }

    // ── Add to cart ───────────────────────────────────────────────────────────

    @Transactional
    public CartResponse addToCart(UUID userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", request.getBookId()));

        int requested = request.getQuantity();
        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getBook().getId().equals(book.getId()))
                .findFirst();

        if (existing.isPresent()) {
            int newQty = existing.get().getQuantity() + requested;
            validateStock(book, newQty);
            existing.get().setQuantity(newQty);
        } else {
            validateStock(book, requested);
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .book(book)
                    .quantity(requested)
                    .build();
            cart.getItems().add(item);
        }

        cartRepository.save(cart);
        return toCartResponse(cart);
    }

    // ── Update quantity ───────────────────────────────────────────────────────

    @Transactional
    public CartResponse updateItem(UUID userId, UUID itemId, int newQuantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = findItemInCart(cart, itemId);
        validateStock(item.getBook(), newQuantity);
        item.setQuantity(newQuantity);
        cartRepository.save(cart);
        return toCartResponse(cart);
    }

    // ── Remove item ───────────────────────────────────────────────────────────

    @Transactional
    public CartResponse removeItem(UUID userId, UUID itemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = findItemInCart(cart, itemId);
        cart.getItems().remove(item);
        cartRepository.save(cart);
        return toCartResponse(cart);
    }

    // ── Clear cart ────────────────────────────────────────────────────────────

    @Transactional
    public void clearCart(UUID userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // ── Guest cart merge ──────────────────────────────────────────────────────

    /**
     * Merges guest cart items (from localStorage) into the user's server cart.
     * Quantities are summed; if the combined quantity exceeds stock it is capped.
     */
    @Transactional
    public CartResponse mergeGuestCart(User user, List<CartItemRequest> guestItems) {
        Cart cart = getOrCreateCart(user.getId());

        for (CartItemRequest guestItem : guestItems) {
            Book book = bookRepository.findById(guestItem.getBookId()).orElse(null);
            if (book == null || book.getStockQuantity() <= 0) {
                continue; // skip books that no longer exist or are out of stock
            }

            Optional<CartItem> existing = cart.getItems().stream()
                    .filter(i -> i.getBook().getId().equals(book.getId()))
                    .findFirst();

            int maxAllowed = book.getStockQuantity();

            if (existing.isPresent()) {
                int combined = existing.get().getQuantity() + guestItem.getQuantity();
                existing.get().setQuantity(Math.min(combined, maxAllowed));
            } else {
                int qty = Math.min(guestItem.getQuantity(), maxAllowed);
                CartItem item = CartItem.builder()
                        .cart(cart)
                        .book(book)
                        .quantity(qty)
                        .build();
                cart.getItems().add(item);
            }
        }

        cartRepository.save(cart);
        return toCartResponse(cart);
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    private Cart getOrCreateCart(UUID userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            // Should exist after registration, but create defensively.
            // Use getReferenceById to get a Hibernate proxy without a SELECT.
            Cart newCart = Cart.builder()
                    .user(userRepository.getReferenceById(userId))
                    .build();
            return cartRepository.save(newCart);
        });
    }

    private CartItem findItemInCart(Cart cart, UUID itemId) {
        return cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));
    }

    private void validateStock(Book book, int requestedQty) {
        if (book.getStockQuantity() < requestedQty) {
            throw new InsufficientStockException(
                    book.getTitle(), requestedQty, book.getStockQuantity());
        }
    }

    // ── Mapping ───────────────────────────────────────────────────────────────

    public CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(this::toCartItemResponse)
                .toList();

        BigDecimal subtotal = itemResponses.stream()
                .map(CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .items(itemResponses)
                .itemCount(itemResponses.stream().mapToInt(CartItemResponse::getQuantity).sum())
                .subtotal(subtotal)
                .build();
    }

    private CartItemResponse toCartItemResponse(CartItem item) {
        BigDecimal unitPrice = item.getBook().getPrice();
        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartItemResponse.builder()
                .id(item.getId())
                .book(toBookSummary(item.getBook()))
                .quantity(item.getQuantity())
                .unitPrice(unitPrice)
                .lineTotal(lineTotal)
                .build();
    }

    public BookSummaryResponse toBookSummary(Book book) {
        return BookSummaryResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .coverImageUrl(book.getCoverImageUrl())
                .price(book.getPrice())
                .averageRating(book.getAverageRating())
                .reviewCount(book.getReviewCount())
                .stockQuantity(book.getStockQuantity())
                .category(book.getCategory() != null ? CategoryResponse.builder()
                        .id(book.getCategory().getId())
                        .name(book.getCategory().getName())
                        .slug(book.getCategory().getSlug())
                        .description(book.getCategory().getDescription())
                        .parentId(book.getCategory().getParent() != null
                                ? book.getCategory().getParent().getId() : null)
                        .build() : null)
                .publisher(book.getPublisher() != null ? PublisherResponse.builder()
                        .id(book.getPublisher().getId())
                        .name(book.getPublisher().getName())
                        .description(book.getPublisher().getDescription())
                        .website(book.getPublisher().getWebsite())
                        .build() : null)
                .build();
    }
}
