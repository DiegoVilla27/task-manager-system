package com.diegovilla.task_manager.features.auth.infrastructure.dto.response;

public record AuthResponseDTO(
  String access_token,
  String refresh_token,
  long expires_in
) {
}
