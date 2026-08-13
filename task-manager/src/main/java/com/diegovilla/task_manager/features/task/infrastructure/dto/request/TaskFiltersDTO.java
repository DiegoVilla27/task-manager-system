package com.diegovilla.task_manager.features.task.infrastructure.dto.request;

import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

/**
 * Data transfer object encapsulating optional query parameters for filtering tasks.
 *
 * @param userId optional user identifier constraint.
 * @param search optional text pattern for matching title or description.
 * @param status optional lifecycle status filter.
 * @since 1.0.0
 */
@Schema(description = "Query parameter filters for querying and paginating tasks")
public record TaskFiltersDTO(
  @Schema(description = "Filter tasks by assigned user ID", example = "123e4567-e89b-12d3-a456-426655440000")
  UUID userId,

  @Schema(description = "Search text pattern matching task title or description", example = "OAuth2")
  String search,

  @Schema(description = "Filter tasks by lifecycle status", example = "PENDING")
  TaskStatus status
) {
}
