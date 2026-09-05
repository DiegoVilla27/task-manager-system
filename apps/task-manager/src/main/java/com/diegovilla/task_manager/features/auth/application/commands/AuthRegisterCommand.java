package com.diegovilla.task_manager.features.auth.application.commands;

/**
 * Command carrying user registration parameters.
 *
 * @param name first name of the registering user.
 * @param lastname optional last name of the registering user.
 * @param email unique email address.
 * @param password raw plain-text password to hash.
 * @since 1.0.0
 */
public record AuthRegisterCommand(String name, String lastname, String email, String password) {}
