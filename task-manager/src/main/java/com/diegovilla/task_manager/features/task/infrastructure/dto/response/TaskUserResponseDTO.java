package com.diegovilla.task_manager.features.task.infrastructure.dto.response;

import java.util.UUID;

public record TaskUserResponseDTO(
  UUID id,
  String name,
  String lastname,
  String email
) {
}
