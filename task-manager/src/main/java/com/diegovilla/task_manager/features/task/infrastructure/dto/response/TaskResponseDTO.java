package com.diegovilla.task_manager.features.task.infrastructure.dto.response;

import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO returned to the client after a task operation.
 *
 * @param id          unique identifier of the task.
 * @param title       title of the task.
 * @param description description of the task.
 * @param status      current lifecycle status of the task.
 * @param userId      the user associated with the task.
 * @param createdAt   timestamp when the task was created.
 * @since 1.0.0
 */
@Schema(description = "Basic public task representation response")
public record TaskResponseDTO(
  @Schema(description = "Unique identifier of the task", example = "987e6543-e21b-12d3-a456-426655440000")
  UUID id,

  @Schema(description = "Title of the task", example = "Implement OAuth2 login")
  String title,

  @Schema(description = "Detailed description of the task", example = "Add support for Google and GitHub OAuth2 providers.")
  String description,

  @Schema(description = "Current lifecycle status of the task", example = "PENDING")
  TaskStatus status,

  @Schema(description = "ID of the user assigned to this task", example = "123e4567-e89b-12d3-a456-426655440000")
  UUID userId,

  @Schema(description = "Creation timestamp", example = "2026-01-01T00:00:00Z")
  Instant createdAt
) {
}
