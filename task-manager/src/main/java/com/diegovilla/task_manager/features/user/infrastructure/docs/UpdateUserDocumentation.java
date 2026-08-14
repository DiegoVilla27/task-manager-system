package com.diegovilla.task_manager.features.user.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.BadRequestApiResponse;
import com.diegovilla.task_manager.core.openapi.common.ConflictApiResponse;
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
 * OpenAPI documentation annotation for the user update endpoint ({@code PATCH /users/{id}}).
 *
 * <p>Documents HTTP 200 OK with {@link UserWithTaskCountResponseDTO} payload and standard error schemas.</p>
 *
 * @since 1.0.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(summary = "Update user", description = "Partially updates user profile information.")
@ApiResponse(responseCode = "200", description = "User updated successfully.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserWithTaskCountResponseDTO.class)))
@BadRequestApiResponse
@UnauthorizedApiResponse
@ForbiddenApiResponse
@NotFoundApiResponse
@ConflictApiResponse
@InternalServerErrorApiResponse
public @interface UpdateUserDocumentation {
}

