package com.diegovilla.task_manager.features.task.application.commands;

/**
 * Immutable command carrying the data required to update an existing task.
 *
 * <p>
 * Both fields are optional; only non-{@code null} values trigger
 * an update of the corresponding property on the domain model.
 * </p>
 *
 * @param title       new title for the task, or {@code null} to keep the
 *                    current value.
 * @param description new description for the task, or {@code null} to keep the
 *                    current value.
 * @since 1.0.0
 */
public record TaskUpdateCommand(
    String title,
    String description) {
}
