package com.bookstore.service;

import com.bookstore.dto.response.PublisherResponse;
import com.bookstore.entity.Publisher;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.PublisherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PublisherService {

    private final PublisherRepository publisherRepository;

    @Transactional(readOnly = true)
    public List<PublisherResponse> listAll() {
        return publisherRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Validates that a publisher exists before the book listing is returned.
     * Throws 404 if not found.
     */
    @Transactional(readOnly = true)
    public void validateExists(UUID publisherId) {
        if (!publisherRepository.existsById(publisherId)) {
            throw new ResourceNotFoundException("Publisher", "id", publisherId);
        }
    }

    private PublisherResponse toResponse(Publisher publisher) {
        return PublisherResponse.builder()
                .id(publisher.getId())
                .name(publisher.getName())
                .description(publisher.getDescription())
                .website(publisher.getWebsite())
                .build();
    }
}
