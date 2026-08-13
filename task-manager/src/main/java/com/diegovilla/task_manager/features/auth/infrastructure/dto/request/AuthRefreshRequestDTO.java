package com.diegovilla.task_manager.features.auth.infrastructure.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Request body required for refreshing JWT access tokens")
public record AuthRefreshRequestDTO(
  @Schema(description = "Valid JWT refresh token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank(message = "Refresh token is required")
  String refresh_token
) {
}
