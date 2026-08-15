package com.diegovilla.task_manager.core.openapi.common;

import com.diegovilla.task_manager.core.errors.dtos.ErrorResponseDTO;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.lang.annotation.*;

/**
 * Meta-annotation that defines a reusable OpenAPI {@code 400 Bad Request} response.
 *
 * <p>Apply this annotation to endpoint-level documentation annotations to automatically include a
 * standardized bad-request response with an example {@link ErrorResponseDTO} payload containing
 * field-level validation errors.
 *
 * @since 1.0.0
 */
@Target(ElementType.ANNOTATION_TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@ApiResponse(
        responseCode = "400",
        description = "The request is invalid or contains validation errors.",
        content =
                @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = ErrorResponseDTO.class),
                        examples =
                                @ExampleObject(
                                        name = "BadRequestResponse",
                                        value =
                                                """
        {
          "timestamp": "2026-08-08T17:15:00Z",
          "status": 400,
          "error": "Bad Request",
          "message": "The request contains validation errors.",
          "errors": [
            {
              "field": "title",
              "value": "ab",
              "message": "Title must be between 3 and 150 characters"
            }
          ]
        }
        """)))
public @interface BadRequestApiResponse {}
