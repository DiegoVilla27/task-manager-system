package com.diegovilla.task_manager.user.application.commands;

public record UserUpdateCommand(
  String name,
  String lastname,
  String email
) {
}
