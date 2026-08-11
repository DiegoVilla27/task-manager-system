package com.diegovilla.task_manager.features.task.infrastructure.dto.response;

import java.util.UUID;

/**
 * Embedded user response DTO included in composite task responses.
 *
 * @param id       unique identifier of the user.
 * @param name     first name of the user.
 * @param lastname last name of the user.
 * @param email    email address of the user.
 * @since 1.0.0
 */
public record TaskUserResponseDTO(
  UUID id,
  String name,
  String lastname,
  String email
) {
}

