package com.bookstore.repository;

import com.bookstore.entity.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PublisherRepository extends JpaRepository<Publisher, UUID> {
}
