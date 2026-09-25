package com.bookstore.controller;

import com.bookstore.dto.response.AuthorResponse;
import com.bookstore.dto.response.BookSummaryResponse;
import com.bookstore.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @GetMapping
    public ResponseEntity<List<AuthorResponse>> listAll() {
        return ResponseEntity.ok(authorService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(authorService.getById(id));
    }

    @GetMapping("/{id}/books")
    public ResponseEntity<List<BookSummaryResponse>> getBooksForAuthor(@PathVariable UUID id) {
        return ResponseEntity.ok(authorService.getBooksForAuthor(id));
    }
}
