package com.diegovilla.task_manager.core.openapi.common;

import com.diegovilla.task_manager.core.errors.dtos.ErrorResponseDTO;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.lang.annotation.*;

/**
 * Meta-annotation that defines a reusable OpenAPI {@code 409 Conflict} response.
 *
 * <p>Apply this annotation to endpoint-level documentation annotations to automatically include a
 * standardized conflict response with an example {@link ErrorResponseDTO} payload.
 *
 * @since 1.0.0
 */
@Target(ElementType.ANNOTATION_TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@ApiResponse(
        responseCode = "409",
        description = "The request conflicts with the current state of the resource.",
        content =
                @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = ErrorResponseDTO.class),
                        examples =
                                @ExampleObject(
                                        name = "ConflictResponse",
                                        value =
                                                """
        {
          "timestamp": "2026-08-08T17:15:00Z",
          "status": 409,
          "error": "Conflict",
          "message": "A resource with the provided title already exists.",
          "errors": null
        }
        """)))
public @interface ConflictApiResponse {}
