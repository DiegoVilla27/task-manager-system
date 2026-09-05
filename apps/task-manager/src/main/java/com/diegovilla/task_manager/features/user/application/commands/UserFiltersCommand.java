package com.diegovilla.task_manager.features.user.application.commands;

import java.util.UUID;

/**
 * Command carrying filtering criteria for user queries.
 *
 * @param search optional text pattern matching name, lastname, email, or id.
 * @param userId optional specific user unique identifier constraint.
 * @since 1.0.0
 */
public record UserFiltersCommand(String search, UUID userId) {}
