package com.diegovilla.task_manager.features.task.infrastructure.dto.request;

import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;

import java.util.UUID;

public record TaskFiltersDTO(
  UUID userId,
  String search,
  TaskStatus status
) {
}
