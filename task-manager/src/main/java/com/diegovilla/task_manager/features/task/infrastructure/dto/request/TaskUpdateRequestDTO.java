package com.diegovilla.task_manager.features.task.infrastructure.dto.request;

import com.diegovilla.task_manager.core.annotations.atleastonefield.AtLeastOneField;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for partially updating an existing task.
 *
 * @param title       new title (3–100 characters), or {@code null} to keep current.
 * @param description new description (3–400 characters), or {@code null} to keep current.
 * @since 1.0.0
 */
@Schema(description = "Request body for partially updating a task. At least one field must be provided.")
@AtLeastOneField(fields = { "title", "description" }, message = "At least one field (title or description) must be provided")
public record TaskUpdateRequestDTO(
  @Schema(description = "Updated title for the task", example = "Updated OAuth2 Login", requiredMode = Schema.RequiredMode.NOT_REQUIRED, minLength = 3, maxLength = 100)
  @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
  String title,

  @Schema(description = "Updated description of the task", example = "Updated details regarding OAuth2 implementation.", requiredMode = Schema.RequiredMode.NOT_REQUIRED, minLength = 3, maxLength = 400)
  @Size(min = 3, max = 400, message = "Description must be between 3 and 400 characters")
  String description
) {
}
