package com.diegovilla.task_manager.core.errors.handlers;

import com.diegovilla.task_manager.core.errors.dtos.ErrorResponseDTO;
import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import com.diegovilla.task_manager.core.errors.factories.ErrorResponseFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

/**
 * Global exception handler responsible for processing all custom business
 * exceptions defined by the application.
 *
 * <p>Every exception extending {@link ApiException} is translated into a
 * standardized {@link ErrorResponseDTO}, ensuring a consistent error
 * contract across the entire API.</p>
 *
 * <p>Framework exceptions thrown by Spring, Jackson or Bean Validation are
 * intentionally handled by {@link SpringExceptionHandler}.</p>
 *
 * @since 1.0.0
 */
@RestControllerAdvice
@RequiredArgsConstructor
public class ApiExceptionHandler {

  private final ErrorResponseFactory errorResponseFactory;

  /**
   * Converts a custom {@link ApiException} into a standardized API response.
   *
   * @param ex custom business exception thrown by the application.
   * @return HTTP response containing the status code and message defined
   *         by the exception.
   */
  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ErrorResponseDTO> handle(ApiException e) {
    return errorResponseFactory.build(
      e.getHttpStatus(),
      e.getMessage(),
      List.of()
    );
  }
}
