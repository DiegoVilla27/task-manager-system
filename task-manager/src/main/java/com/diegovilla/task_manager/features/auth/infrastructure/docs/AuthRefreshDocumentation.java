package com.diegovilla.task_manager.features.auth.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.BadRequestApiResponse;
import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.core.openapi.common.UnauthorizedApiResponse;
import com.diegovilla.task_manager.features.auth.infrastructure.dto.response.AuthResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.lang.annotation.*;

/**
 * Aggregates OpenAPI metadata for the <em>Token Refresh</em> endpoint.
 *
 * @since 1.0.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Refresh JWT token",
        description = "Generates a new access token using a valid refresh token.")
@ApiResponse(
        responseCode = "200",
        description = "Token refreshed successfully.",
        content =
                @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = AuthResponseDTO.class)))
@BadRequestApiResponse
@UnauthorizedApiResponse
@InternalServerErrorApiResponse
public @interface AuthRefreshDocumentation {}
