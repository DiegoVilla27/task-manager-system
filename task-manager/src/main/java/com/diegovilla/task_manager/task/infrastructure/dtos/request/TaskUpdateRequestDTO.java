package com.diegovilla.task_manager.task.infrastructure.dtos.request;

import com.diegovilla.task_manager.core.annotations.atleastonefield.AtLeastOneField;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for partially updating an existing task.
 *
 * <p>At least one field must be provided, enforced by the
 * {@link AtLeastOneField} constraint. Individual field sizes
 * are validated when present.</p>
 *
 * @param title       new title (3–100 characters), or {@code null} to keep current.
 * @param description new description (3–400 characters), or {@code null} to keep current.
 * @since 1.0.0
 */
@AtLeastOneField(
  fields = {"title", "description"},
  message = "At least one field (title or description) must be provided"
)
public record TaskUpdateRequestDTO(
  @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
  String title,
  @Size(min = 3, max = 400, message = "Description must be between 3 and 400 characters")
  String description
) {
}
