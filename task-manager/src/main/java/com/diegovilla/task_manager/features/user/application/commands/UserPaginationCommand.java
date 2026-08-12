package com.diegovilla.task_manager.features.user.application.commands;

import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserFiltersDTO;

/**
 * Command carrying pagination and optional filter parameters for task query operations.
 *
 * @param page    zero-based page index to retrieve.
 * @param limit   maximum number of records per page.
 * @param filters optional filtering criteria for tasks.
 * @since 1.0.0
 */
public record UserPaginationCommand(
  int page,
  int limit,
  UserFiltersDTO filters
) {
}

