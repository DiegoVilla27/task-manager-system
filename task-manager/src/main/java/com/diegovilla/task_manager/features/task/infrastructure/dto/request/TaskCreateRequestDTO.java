package com.diegovilla.task_manager.features.task.infrastructure.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * Request DTO for creating a new task.
 *
 * @param userId      unique identifier of the user creating the task.
 * @param title       title of the task (3–100 characters).
 * @param description description of the task (3–400 characters).
 * @since 1.0.0
 */
@Schema(description = "Request body required to create a new task")
public record TaskCreateRequestDTO(
  @Schema(description = "Unique identifier of the user to assign the task to", example = "123e4567-e89b-12d3-a456-426655440000", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotNull(message = "User ID is required")
  UUID userId,

  @Schema(description = "Title of the task", example = "Implement OAuth2 login", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 3, maxLength = 100)
  @NotBlank(message = "Title is required")
  @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
  String title,

  @Schema(description = "Detailed description of the task requirements", example = "Add support for Google and GitHub OAuth2 authentication providers.", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 3, maxLength = 400)
  @NotBlank(message = "Description is required")
  @Size(min = 3, max = 400, message = "Description must be between 3 and 400 characters")
  String description
) {
}
