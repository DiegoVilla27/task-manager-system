package com.diegovilla.task_manager.features.user.infrastructure.dto.response;

import java.time.Instant;
import java.util.UUID;

public record UserWithTaskCountResponseDTO(
  UUID id,
  String name,
  String lastname,
  String email,
  Long countTasks,
  Instant createdAt
) {
}
