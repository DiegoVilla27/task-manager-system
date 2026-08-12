package com.diegovilla.task_manager.features.auth.application.commands;

public record AuthRefreshCommand(
  String refresh_token
) {
}
