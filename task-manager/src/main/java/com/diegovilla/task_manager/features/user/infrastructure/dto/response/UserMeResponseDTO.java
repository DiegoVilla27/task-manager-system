package com.diegovilla.task_manager.features.user.infrastructure.dto.response;

import java.util.UUID;

public record UserMeResponseDTO(
  UUID id,
  String name,
  String lastname,
  String email
) {
}
