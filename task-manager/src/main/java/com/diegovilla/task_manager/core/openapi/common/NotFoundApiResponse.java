package com.diegovilla.task_manager.core.openapi.common;

import com.diegovilla.task_manager.core.errors.dtos.ErrorResponseDTO;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.*;

/**
 * Meta-annotation that defines a reusable OpenAPI
 * {@code 404 Not Found} response.
 *
 * <p>Apply this annotation to endpoint-level documentation annotations
 * to automatically include a standardized not-found response with
 * an example {@link ErrorResponseDTO} payload.</p>
 *
 * @since 1.0.0
 */
@Target(ElementType.ANNOTATION_TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@ApiResponse(
  responseCode = "404",
  description = "The requested resource could not be found.",
  content = @Content(
    mediaType = "application/json",
    schema = @Schema(implementation = ErrorResponseDTO.class),
    examples = @ExampleObject(
      name = "NotFoundResponse",
      value = """
        {
          "timestamp": "2026-08-08T17:15:00Z",
          "status": 404,
          "error": "Not Found",
          "message": "Resource with the provided identifier was not found",
          "errors": null
        }
        """
    )
  )
)
public @interface NotFoundApiResponse {
}
