package com.diegovilla.task_manager.features.user.domain.exceptions;

import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import org.springframework.http.HttpStatus;

/**
 * Exception thrown when attempting to register or update a user with an email address that is
 * already registered by another account.
 *
 * <p>Mapped to HTTP {@code 409 Conflict}.
 *
 * @since 1.0.0
 */
public class UserAlreadyExistsException extends ApiException {

    /** Creates a new exception with a standard conflict message. */
    public UserAlreadyExistsException() {
        super(HttpStatus.CONFLICT, "A user with this email already exists.");
    }
}
