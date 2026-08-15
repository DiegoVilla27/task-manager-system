package com.diegovilla.task_manager.features.user.application.commands;

/**
 * Command carrying pagination parameters for user query operations.
 *
 * @param page zero-based page index to retrieve.
 * @param limit maximum number of records per page.
 * @since 1.0.0
 */
public record UserPaginationCommand(int page, int limit) {}
