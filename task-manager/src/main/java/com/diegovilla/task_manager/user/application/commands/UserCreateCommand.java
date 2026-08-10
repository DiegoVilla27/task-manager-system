package com.diegovilla.task_manager.user.application.commands;

public record UserCreateCommand(
  String name,
  String lastname,
  String email,
  String password
) {
}
