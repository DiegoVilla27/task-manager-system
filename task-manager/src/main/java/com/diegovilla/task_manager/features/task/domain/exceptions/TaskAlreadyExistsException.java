package com.diegovilla.task_manager.features.task.domain.exceptions;

import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import org.springframework.http.HttpStatus;

/**
 * Exception thrown when attempting to create or rename a task using a title that already belongs to
 * another task.
 *
 * <p>Mapped to HTTP {@code 409 Conflict}.
 *
 * @since 1.0.0
 */
public class TaskAlreadyExistsException extends ApiException {

    /** Creates a new exception with a default conflict message. */
    public TaskAlreadyExistsException() {
        super(HttpStatus.CONFLICT, "A task with this title already exists.");
    }
}
