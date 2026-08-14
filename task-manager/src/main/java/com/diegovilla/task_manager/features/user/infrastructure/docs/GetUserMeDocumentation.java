package com.diegovilla.task_manager.features.user.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.core.openapi.common.UnauthorizedApiResponse;
import com.diegovilla.task_manager.features.user.infrastructure.dto.response.UserMeResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.*;

/**
 * Aggregates OpenAPI metadata for the <em>Get Current User Profile</em> endpoint.
 *
 * <p>Documents the {@code GET /users/me} operation which resolves the authenticated
 * user's profile details from the JWT bearer token present in the security context.</p>
 *
 * @since 1.0.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
  summary = "Get current authenticated user profile",
  description = "Retrieves the identity and profile information of the currently authenticated user based on the security context."
)
@ApiResponse(
  responseCode = "200",
  description = "User profile retrieved successfully.",
  content = @Content(
    mediaType = "application/json",
    schema = @Schema(implementation = UserMeResponseDTO.class)
  )
)
@UnauthorizedApiResponse
@InternalServerErrorApiResponse
public @interface GetUserMeDocumentation {
}
