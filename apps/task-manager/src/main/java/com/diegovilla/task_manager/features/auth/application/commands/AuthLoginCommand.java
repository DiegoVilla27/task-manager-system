package com.diegovilla.task_manager.features.auth.application.commands;

/**
 * Command carrying user credentials required for authentication.
 *
 * @param email registered email address.
 * @param password raw plain-text password.
 * @since 1.0.0
 */
public record AuthLoginCommand(String email, String password) {}
