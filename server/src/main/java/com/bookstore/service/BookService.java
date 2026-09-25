package com.bookstore.service;

import com.bookstore.dto.response.AuthorResponse;
import com.bookstore.dto.response.BookDetailResponse;
import com.bookstore.dto.response.BookSummaryResponse;
import com.bookstore.dto.response.CategoryResponse;
import com.bookstore.dto.response.PagedResponse;
import com.bookstore.dto.response.PublisherResponse;
import com.bookstore.entity.Book;
import com.bookstore.entity.Category;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CategoryRepository;
import com.bookstore.repository.spec.BookSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final CartService cartService; // reuses toBookSummary mapper
    private final AuthorService authorService;

    // ── Search / filter ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public PagedResponse<BookSummaryResponse> searchBooks(
            String query,
            UUID categoryId,
            UUID publisherId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BigDecimal minRating,
            Boolean inStockOnly,
            Pageable pageable) {

        Specification<Book> spec = BookSpecifications.build(
                query, categoryId, publisherId, minPrice, maxPrice, minRating, inStockOnly);

        Page<Book> page = bookRepository.findAll(spec, pageable);
        return toPagedResponse(page);
    }

    // ── Book detail ───────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public BookDetailResponse getBookById(UUID id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));

        UUID categoryId = book.getCategory() != null ? book.getCategory().getId() : null;
        String author   = book.getAuthor();

        // Pageable.ofSize(6) acts as LIMIT — portable JPQL, no LIMIT keyword needed
        Pageable relatedPageable = PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "averageRating"));
        List<Book> related = (categoryId != null)
                ? bookRepository.findRelatedBooks(id, categoryId, author, relatedPageable)
                : List.of();

        return toBookDetail(book, related);
    }

    // ── Browse by category ────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public PagedResponse<BookSummaryResponse> getBooksByCategory(String slug, Pageable pageable) {
        // Validate the category exists
        if (!categoryRepository.existsBySlug(slug)) {
            throw new ResourceNotFoundException("Category", "slug", slug);
        }
        Page<Book> page = bookRepository.findByCategorySlug(slug, pageable);
        return toPagedResponse(page);
    }

    // ── Browse by publisher ───────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public PagedResponse<BookSummaryResponse> getBooksByPublisher(UUID publisherId, Pageable pageable) {
        // Publisher existence is validated upstream in PublisherController before this is called.
        Page<Book> page = bookRepository.findByPublisherId(publisherId, pageable);
        return toPagedResponse(page);
    }

    // ── Mapping helpers ───────────────────────────────────────────────────────

    private PagedResponse<BookSummaryResponse> toPagedResponse(Page<Book> page) {
        List<BookSummaryResponse> content = page.getContent().stream()
                .map(cartService::toBookSummary)
                .toList();

        return PagedResponse.<BookSummaryResponse>builder()
                .content(content)
                .pagination(PagedResponse.PageMetadata.builder()
                        .page(page.getNumber())
                        .size(page.getSize())
                        .totalElements(page.getTotalElements())
                        .totalPages(page.getTotalPages())
                        .build())
                .build();
    }

    private BookDetailResponse toBookDetail(Book book, List<Book> related) {
        AuthorResponse authorDetail = (book.getAuthorEntity() != null)
                ? authorService.toResponse(book.getAuthorEntity())
                : null;
        return BookDetailResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .coverImageUrl(book.getCoverImageUrl())
                .price(book.getPrice())
                .stockQuantity(book.getStockQuantity())
                .description(book.getDescription())
                .pageCount(book.getPageCount())
                .language(book.getLanguage())
                .publishedDate(book.getPublishedDate())
                .averageRating(book.getAverageRating())
                .reviewCount(book.getReviewCount())
                .category(toCategoryResponse(book.getCategory()))
                .publisher(toPublisherResponse(book.getPublisher()))
                .authorDetail(authorDetail)
                .relatedBooks(related.stream().map(cartService::toBookSummary).toList())
                .build();
    }

    private CategoryResponse toCategoryResponse(Category category) {
        if (category == null) return null;
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .build();
    }

    private PublisherResponse toPublisherResponse(
            com.bookstore.entity.Publisher publisher) {
        if (publisher == null) return null;
        return PublisherResponse.builder()
                .id(publisher.getId())
                .name(publisher.getName())
                .description(publisher.getDescription())
                .website(publisher.getWebsite())
                .build();
    }
}
