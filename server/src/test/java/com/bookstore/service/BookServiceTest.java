package com.bookstore.service;

import com.bookstore.dto.response.BookDetailResponse;
import com.bookstore.dto.response.BookSummaryResponse;
import com.bookstore.dto.response.PagedResponse;
import com.bookstore.entity.Book;
import com.bookstore.entity.Category;
import com.bookstore.entity.Publisher;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

// Suppress unchecked warnings from Mockito generic matchers
@SuppressWarnings("unchecked")

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock private BookRepository bookRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private CartService cartService;

    @InjectMocks
    private BookService bookService;

    private Category category;
    private Publisher publisher;
    private Book book;
    private UUID bookId;

    @BeforeEach
    void setUp() {
        bookId = UUID.randomUUID();

        category = new Category();
        category.setId(UUID.randomUUID());
        category.setName("Software Engineering");
        category.setSlug("software-engineering");

        publisher = new Publisher();
        publisher.setId(UUID.randomUUID());
        publisher.setName("O'Reilly Media");

        book = Book.builder()
                .id(bookId)
                .title("Clean Code")
                .author("Robert C. Martin")
                .isbn("978-0-13-235088-4")
                .price(new BigDecimal("44.99"))
                .stockQuantity(80)
                .averageRating(new BigDecimal("4.70"))
                .reviewCount(5210)
                .pageCount(431)
                .language("English")
                .publishedDate(LocalDate.of(2008, 8, 1))
                .category(category)
                .publisher(publisher)
                .build();
    }

    @Test
    void getBookById_existingBook_returnsDetail() {
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));
        when(bookRepository.findRelatedBooks(eq(bookId), eq(category.getId()), eq("Robert C. Martin"), any(Pageable.class)))
                .thenReturn(List.of());

        BookDetailResponse response = bookService.getBookById(bookId);

        assertThat(response.getId()).isEqualTo(bookId);
        assertThat(response.getTitle()).isEqualTo("Clean Code");
        assertThat(response.getIsbn()).isEqualTo("978-0-13-235088-4");
        assertThat(response.getRelatedBooks()).isEmpty();
    }

    @Test
    void getBookById_notFound_throws404() {
        when(bookRepository.findById(bookId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.getBookById(bookId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Book");
    }

    @Test
    void getBooksByCategory_validSlug_returnsPage() {
        Pageable pageable = PageRequest.of(0, 20);
        when(categoryRepository.existsBySlug("software-engineering")).thenReturn(true);
        when(bookRepository.findByCategorySlug("software-engineering", pageable))
                .thenReturn(new PageImpl<>(List.of(book), pageable, 1));
        when(cartService.toBookSummary(book)).thenReturn(
                BookSummaryResponse.builder().id(bookId).title("Clean Code").build());

        PagedResponse<BookSummaryResponse> response =
                bookService.getBooksByCategory("software-engineering", pageable);

        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getPagination().getTotalElements()).isEqualTo(1);
    }

    @Test
    void getBooksByCategory_unknownSlug_throws404() {
        when(categoryRepository.existsBySlug("unknown")).thenReturn(false);

        assertThatThrownBy(() -> bookService.getBooksByCategory("unknown", PageRequest.of(0, 20)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Category");
    }

    @Test
    @SuppressWarnings("unchecked")
    void searchBooks_withQuery_appliesSpecification() {
        Pageable pageable = PageRequest.of(0, 20);
        when(bookRepository.findAll(any(Specification.class), eq(pageable)))
                .thenReturn(new PageImpl<>(List.of(book), pageable, 1));
        when(cartService.toBookSummary(book)).thenReturn(
                BookSummaryResponse.builder().id(bookId).title("Clean Code").build());

        PagedResponse<BookSummaryResponse> response = bookService.searchBooks(
                "clean", null, null,
                new BigDecimal("10"), new BigDecimal("100"),
                new BigDecimal("4.0"), true, pageable);

        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getPagination().getTotalPages()).isEqualTo(1);
    }

    @Test
    void getBookById_relatedBooksPopulated() {
        Book related = Book.builder()
                .id(UUID.randomUUID())
                .title("The Pragmatic Programmer")
                .author("David Thomas")
                .price(new BigDecimal("49.99"))
                .category(category)
                .build();

        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));
        when(bookRepository.findRelatedBooks(eq(bookId), eq(category.getId()), eq("Robert C. Martin"), any(Pageable.class)))
                .thenReturn(List.of(related));
        when(cartService.toBookSummary(related)).thenReturn(
                BookSummaryResponse.builder().id(related.getId())
                        .title("The Pragmatic Programmer").build());

        BookDetailResponse response = bookService.getBookById(bookId);

        assertThat(response.getRelatedBooks()).hasSize(1);
        assertThat(response.getRelatedBooks().get(0).getTitle())
                .isEqualTo("The Pragmatic Programmer");
    }
}
