package com.diegovilla.task_manager.core.errors.exceptions;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a domain rule or business invariant is violated.
 *
 * <p>Mapped to HTTP {@code 422 Unprocessable Content} to indicate that the server understands the
 * request but cannot process it due to semantic errors in the domain logic.
 *
 * @since 1.0.0
 */
public class DomainException extends ApiException {

    /**
     * Creates a new domain exception with the specified detail message.
     *
     * @param message human-readable description of the violated invariant.
     */
    public DomainException(String message) {
        super(HttpStatus.UNPROCESSABLE_CONTENT, message);
    }
}
