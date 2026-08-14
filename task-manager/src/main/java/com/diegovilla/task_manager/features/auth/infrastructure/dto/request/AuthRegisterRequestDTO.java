package com.diegovilla.task_manager.features.auth.infrastructure.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request payload carrying user details required for self-registration.
 *
 * @param name     first name of the user (3–100 characters).
 * @param lastname optional last name of the user (3–100 characters).
 * @param email    unique email address (max 150 characters).
 * @param password secure password (8–20 characters).
 * @since 1.0.0
 */
@Schema(description = "Request body required for registering a new user account")
public record AuthRegisterRequestDTO(
  @Schema(description = "First name of the user", example = "John", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 3, maxLength = 100)
  @NotBlank(message = "Name is required")
  @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
  String name,

  @Schema(description = "Last name of the user", example = "Doe", requiredMode = Schema.RequiredMode.NOT_REQUIRED, minLength = 3, maxLength = 100)
  @Size(min = 3, max = 100, message = "Last name must be between 3 and 100 characters")
  String lastname,

  @Schema(description = "Unique email address for the account", example = "john.doe@example.com", requiredMode = Schema.RequiredMode.REQUIRED, maxLength = 150)
  @NotBlank(message = "Email is required")
  @Email(message = "Email has to be valid")
  @Size(max = 150, message = "Email must be at most 150 characters")
  String email,

  @Schema(description = "Password for the account", example = "P@ssw0rd123!", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 8, maxLength = 20)
  @NotBlank(message = "Password is required")
  @Size(min = 8, max = 20, message = "Password must be between 8 and 20 characters")
  String password
) {
}
