package com.diegovilla.task_manager.core.errors.exceptions;

import com.diegovilla.task_manager.core.errors.dtos.ErrorResponseDTO;
import com.diegovilla.task_manager.core.errors.handlers.ApiExceptionHandler;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base abstract class for all application-specific domain and business
 * exceptions.
 *
 * <p>
 * Encapsulates an HTTP status code and a descriptive error message. Subclasses
 * are
 * automatically captured by {@link ApiExceptionHandler}, which converts them
 * into a standardized
 * {@link ErrorResponseDTO}.
 * </p>
 *
 * @author Diego Villa
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
   * @param httpStatus HTTP status that should be returned to the client.
   * @param message    human-readable description of the error.
   */
  protected ApiException(HttpStatus httpStatus, String message) {
    super(message);
    this.httpStatus = httpStatus;
  }
}
