package com.diegovilla.task_manager.features.user.application.commands;

public record UserUpdateCommand(
    String name,
    String lastname,
    String email) {
}
