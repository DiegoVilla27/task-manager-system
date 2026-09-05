package com.diegovilla.task_manager.features.task.application.commands;

import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;
import java.util.UUID;

/**
 * Application command carrying criteria for filtering task query results.
 *
 * @param userId optional target user identifier to restrict task search.
 * @param search optional text pattern for matching task title or description.
 * @param status optional lifecycle status filter.
 * @since 1.0.0
 */
public record TaskFiltersCommand(UUID userId, String search, TaskStatus status) {}
