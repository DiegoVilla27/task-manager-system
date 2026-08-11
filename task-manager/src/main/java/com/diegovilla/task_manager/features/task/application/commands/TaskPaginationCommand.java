package com.diegovilla.task_manager.features.task.application.commands;

import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskFiltersDTO;

public record TaskPaginationCommand(
  int page,
  int limit,
  TaskFiltersDTO filters
) {
}
