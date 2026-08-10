package com.diegovilla.task_manager.features.task.application.commands;

import java.util.UUID;

/**
 * Immutable command carrying the data required to create a new task.
 *
 * <p>
 * All fields are required.
 * </p>
 *
 * @param title       new title for the task.
 * @param description new description for the task.
 * @param userId      user id for the task.
 * @since 1.0.0
 */
public record TaskCreateCommand(
        String title,
        String description,
        UUID userId) {
}
