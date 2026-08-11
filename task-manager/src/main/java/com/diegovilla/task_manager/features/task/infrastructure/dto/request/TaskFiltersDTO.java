package com.diegovilla.task_manager.features.task.infrastructure.dto.request;

import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;

import java.util.UUID;

/**
 * Data transfer object encapsulating optional query parameters for filtering tasks.
 *
 * @param userId optional user identifier constraint.
 * @param search optional text pattern for matching title or description.
 * @param status optional lifecycle status filter.
 * @since 1.0.0
 */
public record TaskFiltersDTO(
  UUID userId,
  String search,
  TaskStatus status
) {
}

