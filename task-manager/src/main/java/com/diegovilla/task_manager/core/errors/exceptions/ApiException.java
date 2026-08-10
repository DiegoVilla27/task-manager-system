package com.diegovilla.task_manager.core.errors.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base class for all business exceptions exposed by the application.
 *
 * <p>Every custom exception intended to be returned to the client must
 * extend this class. Each exception defines the HTTP status code and the
 * message that will be included in the API response.</p>
 *
 * <p>Instances of this class are handled centrally by
 * {@link ApiExceptionHandler}, which converts them into a standardized
 * {@link ErrorResponseDTO}.</p>
 *
 * @since 1.0.0
 */
@Getter
public abstract class ApiException extends RuntimeException {
  /**
   * HTTP status associated with the exception.
   */
  private final HttpStatus httpStatus;

  /**
   * Creates a new business exception.
   *
   * @param httpStatus  HTTP status that should be returned to the client.
   * @param message human-readable description of the error.
   */
  protected ApiException(HttpStatus httpStatus, String message) {
    super(message);
    this.httpStatus = httpStatus;
  }
}
