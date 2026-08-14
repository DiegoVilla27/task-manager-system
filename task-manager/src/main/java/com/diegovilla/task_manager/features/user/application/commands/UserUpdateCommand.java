package com.diegovilla.task_manager.features.user.application.commands;

/**
 * Command carrying mutable profile fields for updating a user.
 *
 * <p>Fields with non-{@code null} values will be updated on the domain model.</p>
 *
 * @param name     updated first name of the user, or {@code null} to leave unchanged.
 * @param lastname updated last name of the user, or {@code null} to leave unchanged.
 * @param email    updated email address of the user, or {@code null} to leave unchanged.
 * @since 1.0.0
 */
public record UserUpdateCommand(
    String name,
    String lastname,
    String email) {
}

