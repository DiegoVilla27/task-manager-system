package com.diegovilla.task_manager.core.errors.dtos;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.List;

/**
 * Standard error response returned by the API when a request
 * cannot be processed successfully.
 *
 * <p>This DTO provides a consistent error contract for both framework
 * and business exceptions handled by the application.</p>
 *
 * @param timestamp date and time when the error occurred.
 * @param status    HTTP status code returned by the server.
 * @param error     HTTP reason phrase associated with the status code.
 * @param message   human-readable description of the error.
 * @param errors    collection of field-level validation errors. Empty when
 *                  the error is not related to request validation.
 * @since 1.0.0
 */
@Schema(description = "Standardized error response returned when an API request fails")
public record ErrorResponseDTO(

  @Schema(
    description = "UTC timestamp when the error occurred",
    example = "2026-08-07T14:32:15Z"
  )
  Instant timestamp,

  @Schema(
    description = "HTTP status code integer value",
    example = "400"
  )
  Integer status,

  @Schema(
    description = "HTTP status phrase / category",
    example = "Bad Request"
  )
  String error,

  @Schema(
    description = "Human-readable summary message describing the error",
    example = "The request contains validation errors."
  )
  String message,

  @Schema(
    description = "Detailed list of field-level validation errors, if applicable"
  )
  List<FieldErrorDTO> errors
) {
}
