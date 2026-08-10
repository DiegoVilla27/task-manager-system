package com.diegovilla.task_manager.core.errors.dtos;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Represents a validation error associated with a specific request field.
 *
 * <p>Used as part of {@link ErrorResponseDTO} to provide detailed
 * information about validation or binding errors returned by the API.</p>
 *
 * @param field   name of the field that caused the error.
 * @param value   value received from the client.
 * @param message human-readable description of the validation error.
 * @since 1.0.0
 */
@Schema(description = "Details of a specific field-level validation error")
public record FieldErrorDTO(

  @Schema(
    description = "Name of the field or path variable that failed validation",
    example = "email"
  )
  String field,

  @Schema(
    description = "The rejected value sent by the client, if available",
    example = "invalid-email-format"
  )
  Object value,

  @Schema(
    description = "User-friendly validation error message explaining the failure constraint",
    example = "Email has to be valid"
  )
  String message
) {
}
