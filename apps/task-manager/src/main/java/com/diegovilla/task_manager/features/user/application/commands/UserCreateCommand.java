package com.diegovilla.task_manager.features.user.application.commands;

/**
 * Command carrying the data required to create a new user.
 *
 * @param name first name of the user.
 * @param lastname last name of the user.
 * @param email email address for the new account.
 * @param password raw plain-text password.
 * @since 1.0.0
 */
public record UserCreateCommand(String name, String lastname, String email, String password) {}
