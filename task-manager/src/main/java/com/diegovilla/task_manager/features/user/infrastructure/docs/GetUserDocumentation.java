package com.diegovilla.task_manager.features.user.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.BadRequestApiResponse;
import com.diegovilla.task_manager.core.openapi.common.ForbiddenApiResponse;
import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.core.openapi.common.NotFoundApiResponse;
import com.diegovilla.task_manager.core.openapi.common.UnauthorizedApiResponse;
import com.diegovilla.task_manager.features.user.infrastructure.dto.response.UserWithTaskCountResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.*;

/**
 * OpenAPI documentation annotation for the user lookup endpoint ({@code GET /users/{id}}).
 *
 * <p>Documents HTTP 200 OK with {@link UserWithTaskCountResponseDTO} payload and standard error schemas.</p>
 *
 * @since 1.0.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(summary = "Get user by ID", description = "Retrieves a single user by their unique identifier along with their total task count.")
@ApiResponse(responseCode = "200", description = "User retrieved successfully.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserWithTaskCountResponseDTO.class)))
@BadRequestApiResponse
@UnauthorizedApiResponse
@ForbiddenApiResponse
@NotFoundApiResponse
@InternalServerErrorApiResponse
public @interface GetUserDocumentation {
}

