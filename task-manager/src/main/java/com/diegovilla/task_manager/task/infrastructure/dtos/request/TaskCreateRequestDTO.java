package com.diegovilla.task_manager.task.infrastructure.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * Request DTO for creating a new task.
 *
 * <p>Both fields are mandatory and validated using Bean Validation
 * constraints before reaching the service layer.</p>
 *
 * @param userId      unique identifier of the user creating the task.
 * @param title       title of the task (3–100 characters).
 * @param description description of the task (3–400 characters).
 * @since 1.0.0
 */
public record TaskCreateRequestDTO(
  @NotNull(message = "User ID is required")
  UUID userId,
  @NotBlank(message = "Title is required")
  @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
  String title,
  @NotBlank(message = "Description is required")
  @Size(min = 3, max = 400, message = "Description must be between 3 and 400 characters")
  String description
) {
}
