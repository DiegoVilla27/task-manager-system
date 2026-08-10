package com.diegovilla.task_manager.core.errors.exceptions;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a requested resource cannot be found.
 */
public class ResourceNotFoundException extends ApiException {

  /**
   * Creates a new exception with the specified detail message.
   *
   * @param message error description.
   */
  public ResourceNotFoundException(String message) {
    super(HttpStatus.NOT_FOUND, message);
  }
}
