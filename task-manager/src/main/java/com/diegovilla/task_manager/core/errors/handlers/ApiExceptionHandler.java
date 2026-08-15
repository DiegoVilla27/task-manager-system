package com.diegovilla.task_manager.core.errors.handlers;

import com.diegovilla.task_manager.core.errors.dtos.ErrorResponseDTO;
import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import com.diegovilla.task_manager.core.errors.factories.ErrorResponseFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler responsible for processing all custom business exceptions defined by the
 * application.
 *
 * <p>Every exception extending {@link ApiException} is translated into a standardized {@link
 * ErrorResponseDTO}, ensuring a consistent error contract across the entire API.
 *
 * <p>Framework exceptions thrown by Spring, Jackson or Bean Validation are intentionally handled by
 * {@link SpringExceptionHandler}.
 *
 * @since 1.0.0
 */
@RestControllerAdvice
@RequiredArgsConstructor
public class ApiExceptionHandler {

    private final ErrorResponseFactory errorResponseFactory;

    /**
     * Handles domain and application-specific exceptions derived from {@link ApiException}.
     *
     * @param e custom business exception thrown by the application.
     * @return a structured {@link ErrorResponseDTO} wrapped in a {@link ResponseEntity}.
     */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponseDTO> handle(ApiException e) {
        return errorResponseFactory.build(e.getHttpStatus(), e.getMessage(), List.of());
    }
}
