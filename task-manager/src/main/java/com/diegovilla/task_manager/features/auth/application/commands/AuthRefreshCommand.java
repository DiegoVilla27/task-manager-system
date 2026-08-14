package com.diegovilla.task_manager.features.auth.application.commands;

/**
 * Command carrying a refresh token to generate a new access token.
 *
 * @param refresh_token signed JWT refresh token string.
 * @since 1.0.0
 */
public record AuthRefreshCommand(
  String refresh_token
) {
}

