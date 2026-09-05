package com.diegovilla.task_manager.core.errors.factories;

import com.diegovilla.task_manager.core.errors.dtos.ErrorResponseDTO;
import com.diegovilla.task_manager.core.errors.dtos.FieldErrorDTO;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

/**
 * Factory responsible for creating standardized HTTP error responses.
 *
 * <p>All exception handlers use this factory to guarantee that every error returned by the API
 * follows the same response structure, regardless of the exception origin.
 *
 * @since 1.0.0
 */
@Component
public class ErrorResponseFactory {

    /**
     * Creates a standardized error response.
     *
     * @param status HTTP status associated with the error.
     * @param message human-readable description of the error.
     * @param errors collection of field-level validation errors. If {@code null}, an empty list is
     *     returned.
     * @return a {@link ResponseEntity} containing an {@link ErrorResponseDTO}.
     */
    public ResponseEntity<ErrorResponseDTO> build(
            HttpStatus status, String message, List<FieldErrorDTO> errors) {

        return ResponseEntity.status(status)
                .body(
                        new ErrorResponseDTO(
                                Instant.now(),
                                status.value(),
                                status.getReasonPhrase(),
                                message,
                                errors == null ? List.of() : errors));
    }
}
