package com.diegovilla.task_manager.features.auth.application.commands;

public record AuthLoginCommand(
  String email,
  String password
) {
}
