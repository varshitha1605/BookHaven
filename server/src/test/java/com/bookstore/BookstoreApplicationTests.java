package com.bookstore;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class BookstoreApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the Spring application context starts without errors
    }
}
