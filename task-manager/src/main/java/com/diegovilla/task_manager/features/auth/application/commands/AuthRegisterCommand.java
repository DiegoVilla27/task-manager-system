package com.diegovilla.task_manager.features.auth.application.commands;

public record AuthRegisterCommand(
  String name,
  String lastname,
  String email,
  String password
) {
}
