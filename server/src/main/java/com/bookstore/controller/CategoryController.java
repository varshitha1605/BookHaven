package com.bookstore.controller;

import com.bookstore.dto.response.BookSummaryResponse;
import com.bookstore.dto.response.CategoryResponse;
import com.bookstore.dto.response.PagedResponse;
import com.bookstore.service.BookService;
import com.bookstore.service.CategoryService;
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

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Browse books by category")
public class CategoryController {

    private final CategoryService categoryService;
    private final BookService bookService;

    @GetMapping
    @Operation(summary = "List all categories")
    @ApiResponse(responseCode = "200", description = "Flat list of all categories (parentId indicates hierarchy)")
    public ResponseEntity<List<CategoryResponse>> listCategories() {
        return ResponseEntity.ok(categoryService.listAll());
    }

    @GetMapping("/{slug}/books")
    @Operation(summary = "List books in a category by slug")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Paged book list for the category"),
        @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<PagedResponse<BookSummaryResponse>> listBooksByCategory(
            @PathVariable String slug,
            @Parameter(description = "Zero-based page number") @RequestParam(defaultValue = "0")  int page,
            @Parameter(description = "Items per page")         @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort: field,direction")  @RequestParam(defaultValue = "title,asc") String sort) {

        Pageable pageable = buildPageable(page, size, sort);
        return ResponseEntity.ok(bookService.getBooksByCategory(slug, pageable));
    }

    private Pageable buildPageable(int page, int size, String sort) {
        size = Math.min(size, 100);
        String[] parts = sort.split(",");
        Sort.Direction direction = parts.length > 1 && parts[1].equalsIgnoreCase("desc")
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageRequest.of(page, size, Sort.by(direction, parts[0]));
    }
}
