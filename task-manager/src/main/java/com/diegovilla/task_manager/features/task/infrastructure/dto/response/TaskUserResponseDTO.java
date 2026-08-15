package com.diegovilla.task_manager.features.task.infrastructure.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

/**
 * Embedded user response DTO included in composite task responses.
 *
 * @param id unique identifier of the user.
 * @param name first name of the user.
 * @param lastname last name of the user.
 * @param email email address of the user.
 * @since 1.0.0
 */
@Schema(description = "Embedded user information nested inside task response DTOs")
public record TaskUserResponseDTO(
        @Schema(
                        description = "Unique identifier of the user",
                        example = "123e4567-e89b-12d3-a456-426655440000")
                UUID id,
        @Schema(description = "First name of the user", example = "John") String name,
        @Schema(description = "Last name of the user", example = "Doe") String lastname,
        @Schema(description = "Email address of the user", example = "john.doe@example.com")
                String email) {}
