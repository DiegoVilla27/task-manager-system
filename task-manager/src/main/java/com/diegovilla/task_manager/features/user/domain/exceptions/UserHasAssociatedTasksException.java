package com.diegovilla.task_manager.features.user.domain.exceptions;

import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import org.springframework.http.HttpStatus;

/**
 * Exception thrown when attempting to delete a user who still has associated tasks
 * when force deletion is not enabled.
 *
 * <p>Mapped to HTTP {@code 409 Conflict}.</p>
 *
 * @since 1.0.0
 */
public class UserHasAssociatedTasksException extends ApiException {

  /**
   * Creates a new exception with a default relational integrity conflict message.
   */
  public UserHasAssociatedTasksException() {
    super(HttpStatus.CONFLICT, "Cannot delete user because they have associated tasks.");
  }
}

