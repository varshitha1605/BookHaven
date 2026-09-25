package com.bookstore.service;

import com.bookstore.dto.response.AuthorResponse;
import com.bookstore.dto.response.BookSummaryResponse;
import com.bookstore.entity.Author;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final CartService cartService; // reuses toBookSummary mapper

    @Transactional(readOnly = true)
    public List<AuthorResponse> listAll() {
        return authorRepository.findAllWithBooks().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AuthorResponse getById(UUID id) {
        Author author = authorRepository.findByIdWithBooks(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author", "id", id));
        return toResponse(author);
    }

    @Transactional(readOnly = true)
    public List<BookSummaryResponse> getBooksForAuthor(UUID id) {
        Author author = authorRepository.findByIdWithBooks(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author", "id", id));
        return author.getBooks().stream()
                .map(cartService::toBookSummary)
                .toList();
    }

    public AuthorResponse toResponse(Author author) {
        if (author == null) return null;
        return AuthorResponse.builder()
                .id(author.getId())
                .name(author.getName())
                .bio(author.getBio())
                .genre(author.getGenre())
                .famousWorks(author.getFamousWorks())
                .photoUrl(author.getPhotoUrl())
                .bookCount(author.getBooks() != null ? author.getBooks().size() : 0)
                .build();
    }
}
