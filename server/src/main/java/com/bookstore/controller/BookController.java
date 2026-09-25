package com.bookstore.controller;

import com.bookstore.dto.response.BookDetailResponse;
import com.bookstore.dto.response.BookSummaryResponse;
import com.bookstore.dto.response.PagedResponse;
import com.bookstore.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "Browse, search, and view book details")
public class BookController {

    private final BookService bookService;

    @GetMapping
    @Operation(summary = "Search and filter books",
               description = "Supports full-text search on title/author/ISBN/description plus " +
                             "optional filters for category, publisher, price range, rating, and stock.")
    @ApiResponse(responseCode = "200", description = "Paged search results")
    public ResponseEntity<PagedResponse<BookSummaryResponse>> searchBooks(
            @Parameter(description = "Full-text search term") @RequestParam(required = false) String query,
            @Parameter(description = "Filter by category UUID") @RequestParam(required = false) UUID categoryId,
            @Parameter(description = "Filter by publisher UUID") @RequestParam(required = false) UUID publisherId,
            @Parameter(description = "Minimum price (inclusive)")  @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Maximum price (inclusive)")  @RequestParam(required = false) BigDecimal maxPrice,
            @Parameter(description = "Minimum average rating (inclusive)") @RequestParam(required = false) BigDecimal minRating,
            @Parameter(description = "Return only in-stock books") @RequestParam(defaultValue = "false") Boolean inStockOnly,
            @Parameter(description = "Zero-based page number")    @RequestParam(defaultValue = "0")  int page,
            @Parameter(description = "Items per page")            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field and direction, e.g. price,asc") @RequestParam(defaultValue = "title,asc") String sort) {

        Pageable pageable = buildPageable(page, size, sort);
        return ResponseEntity.ok(
                bookService.searchBooks(query, categoryId, publisherId,
                        minPrice, maxPrice, minRating, inStockOnly, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get book details including related books")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Full book details"),
        @ApiResponse(responseCode = "404", description = "Book not found")
    })
    public ResponseEntity<BookDetailResponse> getBook(@PathVariable UUID id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    // ── Pageable helper ───────────────────────────────────────────────────────

    private Pageable buildPageable(int page, int size, String sort) {
        size = Math.min(size, 100); // cap at 100
        String[] parts = sort.split(",");
        Sort.Direction direction = parts.length > 1 && parts[1].equalsIgnoreCase("desc")
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageRequest.of(page, size, Sort.by(direction, parts[0]));
    }
}
