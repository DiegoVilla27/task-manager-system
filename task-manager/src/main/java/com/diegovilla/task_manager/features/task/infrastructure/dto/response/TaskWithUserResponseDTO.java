package com.diegovilla.task_manager.features.task.infrastructure.dto.response;

import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;

import java.time.Instant;
import java.util.UUID;

/**
 * Composite HTTP response DTO representing a task along with embedded owner user details.
 *
 * @param id          unique identifier of the task.
 * @param title       title of the task.
 * @param description detailed description of the task.
 * @param status      current lifecycle status of the task.
 * @param user        embedded owner user details.
 * @param createdAt   creation timestamp.
 * @since 1.0.0
 */
public record TaskWithUserResponseDTO(
  UUID id,
  String title,
  String description,
  TaskStatus status,
  TaskUserResponseDTO user,
  Instant createdAt
) {
}

