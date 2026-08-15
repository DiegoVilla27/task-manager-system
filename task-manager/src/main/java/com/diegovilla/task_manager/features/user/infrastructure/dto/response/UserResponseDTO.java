package com.diegovilla.task_manager.features.user.infrastructure.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.UUID;

/**
 * Public response representation of a user account.
 *
 * @param id unique identifier (UUID) of the user.
 * @param name first name of the user.
 * @param lastname last name of the user.
 * @param email registered email address.
 * @param createdAt registration timestamp.
 * @since 1.0.0
 */
@Schema(description = "Public user information response")
public record UserResponseDTO(
        @Schema(
                        description = "Unique identifier of the user",
                        example = "123e4567-e89b-12d3-a456-426655440000")
                UUID id,
        @Schema(description = "First name of the user", example = "John") String name,
        @Schema(description = "Last name of the user", example = "Doe") String lastname,
        @Schema(description = "Email address of the user", example = "john.doe@example.com")
                String email,
        @Schema(description = "User creation timestamp", example = "2026-01-01T00:00:00Z")
                Instant createdAt) {}
