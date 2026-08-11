package com.diegovilla.task_manager.features.task.application.commands;

import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskFiltersDTO;

/**
 * Command carrying pagination and optional filter parameters for task query operations.
 *
 * @param page    zero-based page index to retrieve.
 * @param limit   maximum number of records per page.
 * @param filters optional filtering criteria for tasks.
 * @since 1.0.0
 */
public record TaskPaginationCommand(
  int page,
  int limit,
  TaskFiltersDTO filters
) {
}

