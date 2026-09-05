package com.diegovilla.task_manager.features.task.application.commands;

/**
 * Command carrying pagination and optional filter parameters for task query operations.
 *
 * @param page zero-based page index to retrieve.
 * @param limit maximum number of records per page.
 * @since 1.0.0
 */
public record TaskPaginationCommand(int page, int limit) {}
