package com.diegovilla.task_manager.features.auth.infrastructure.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AuthRefreshRequestDTO(
  @NotBlank
  String refresh_token
) {
}
