package com.diegovilla.task_manager.core.openapi.common;

import com.diegovilla.task_manager.core.errors.dtos.ErrorResponseDTO;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.*;

/**
 * Meta-annotation that defines a reusable OpenAPI
 * {@code 500 Internal Server Error} response.
 *
 * <p>Apply this annotation to endpoint-level documentation annotations
 * to automatically include a standardized server-error response with
 * an example {@link ErrorResponseDTO} payload.</p>
 *
 * @since 1.0.0
 */
@Target(ElementType.ANNOTATION_TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@ApiResponse(
  responseCode = "500",
  description = "An unexpected error occurred while processing the request.",
  content = @Content(
    mediaType = "application/json",
    schema = @Schema(implementation = ErrorResponseDTO.class),
    examples = @ExampleObject(
      name = "InternalServerErrorResponse",
      value = """
        {
          "timestamp": "2026-08-08T17:15:00Z",
          "status": 500,
          "error": "Internal Server Error",
          "message": "An unexpected error occurred while processing the request",
          "errors": null
        }
        """
    )
  )
)
public @interface InternalServerErrorApiResponse {
}
