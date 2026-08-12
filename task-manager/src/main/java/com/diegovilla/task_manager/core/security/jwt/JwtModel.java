package com.diegovilla.task_manager.core.security.jwt;

public record JwtModel(
  String access_token,
  String refresh_token,
  long expires_in
) {
}
