package com.diegovilla.task_manager.task.infrastructure.dtos.response;

import com.diegovilla.task_manager.task.domain.enums.TaskStatus;
import com.diegovilla.task_manager.user.infrastructure.dtos.response.UserResponseDTO;

import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO returned to the client after a task operation.
 *
 * <p>
 * Contains the publicly visible representation of a task,
 * decoupled from the internal domain model.
 * </p>
 *
 * @param id          unique identifier of the task.
 * @param title       title of the task.
 * @param description description of the task.
 * @param status      current lifecycle status of the task.
 * @param user        the user associated with the task.
 * @param createdAt   timestamp when the task was created.
 * @since 1.0.0
 */
public record TaskResponseDTO(
    UUID id,
    String title,
    String description,
    TaskStatus status,
    UserResponseDTO user,
    Instant createdAt) {
}
