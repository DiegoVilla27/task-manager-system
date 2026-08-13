package com.diegovilla.task_manager.features.user.infrastructure.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "User response DTO including the calculated number of assigned tasks")
public record UserWithTaskCountResponseDTO(
  @Schema(description = "Unique identifier of the user", example = "123e4567-e89b-12d3-a456-426655440000")
  UUID id,

  @Schema(description = "First name of the user", example = "John")
  String name,

  @Schema(description = "Last name of the user", example = "Doe")
  String lastname,

  @Schema(description = "Email address of the user", example = "john.doe@example.com")
  String email,

  @Schema(description = "Total count of tasks assigned to this user", example = "5")
  Long countTasks,

  @Schema(description = "Timestamp when the user account was created", example = "2026-01-01T00:00:00Z")
  Instant createdAt
) {
}
