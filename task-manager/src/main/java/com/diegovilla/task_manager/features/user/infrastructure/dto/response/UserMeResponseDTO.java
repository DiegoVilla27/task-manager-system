package com.diegovilla.task_manager.features.user.infrastructure.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

/**
 * Response DTO representing the profile of the currently authenticated user.
 *
 * <p>Returned by {@code GET /users/me} to provide identity details without exposing sensitive
 * attributes such as passwords or internal security roles.
 *
 * @param id unique identifier of the authenticated user.
 * @param name first name of the user.
 * @param lastname last name of the user.
 * @param email registered email address of the user.
 * @since 1.0.0
 */
@Schema(description = "Authenticated user profile response payload")
public record UserMeResponseDTO(
        @Schema(
                        description = "Unique identifier of the authenticated user",
                        example = "123e4567-e89b-12d3-a456-426655440000")
                UUID id,
        @Schema(description = "First name of the user", example = "John") String name,
        @Schema(description = "Last name of the user", example = "Doe") String lastname,
        @Schema(
                        description = "Registered email address of the user",
                        example = "john.doe@example.com")
                String email) {}
