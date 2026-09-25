package com.bookstore.controller;

import com.bookstore.dto.response.BookSummaryResponse;
import com.bookstore.dto.response.PagedResponse;
import com.bookstore.dto.response.PublisherResponse;
import com.bookstore.service.BookService;
import com.bookstore.service.PublisherService;
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
import java.util.UUID;

@RestController
@RequestMapping("/publishers")
@RequiredArgsConstructor
@Tag(name = "Publishers", description = "Browse books by publisher")
public class PublisherController {

    private final PublisherService publisherService;
    private final BookService bookService;

    @GetMapping
    @Operation(summary = "List all publishers")
    @ApiResponse(responseCode = "200", description = "List of all publishers")
    public ResponseEntity<List<PublisherResponse>> listPublishers() {
        return ResponseEntity.ok(publisherService.listAll());
    }

    @GetMapping("/{id}/books")
    @Operation(summary = "List books by a publisher")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Paged book list for the publisher"),
        @ApiResponse(responseCode = "404", description = "Publisher not found")
    })
    public ResponseEntity<PagedResponse<BookSummaryResponse>> listBooksByPublisher(
            @PathVariable UUID id,
            @Parameter(description = "Zero-based page number") @RequestParam(defaultValue = "0")  int page,
            @Parameter(description = "Items per page")         @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort: field,direction")  @RequestParam(defaultValue = "title,asc") String sort) {

        publisherService.validateExists(id); // throws 404 if publisher not found
        Pageable pageable = buildPageable(page, size, sort);
        return ResponseEntity.ok(bookService.getBooksByPublisher(id, pageable));
    }

    private Pageable buildPageable(int page, int size, String sort) {
        size = Math.min(size, 100);
        String[] parts = sort.split(",");
        Sort.Direction direction = parts.length > 1 && parts[1].equalsIgnoreCase("desc")
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageRequest.of(page, size, Sort.by(direction, parts[0]));
    }
}
