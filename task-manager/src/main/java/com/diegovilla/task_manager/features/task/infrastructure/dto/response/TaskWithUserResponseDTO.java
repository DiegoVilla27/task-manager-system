package com.diegovilla.task_manager.features.task.infrastructure.dto.response;

import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;

import java.time.Instant;
import java.util.UUID;

public record TaskWithUserResponseDTO(
  UUID id,
  String title,
  String description,
  TaskStatus status,
  TaskUserResponseDTO user,
  Instant createdAt
) {
}
