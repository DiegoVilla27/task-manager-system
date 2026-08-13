package com.diegovilla.task_manager.features.auth.infrastructure.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Request body required for user login authentication")
public record AuthLoginRequestDTO(
  @Schema(description = "Registered email address of the user", example = "john.doe@example.com", requiredMode = Schema.RequiredMode.REQUIRED, maxLength = 150)
  @Email(message = "Email has to be valid")
  @Size(max = 150, message = "Email must be at most 150 characters")
  String email,

  @Schema(description = "User account password", example = "P@ssw0rd123!", requiredMode = Schema.RequiredMode.REQUIRED, maxLength = 50)
  @NotBlank(message = "Password is required")
  @Size(max = 50, message = "must be at most 50 characters")
  String password
) {
}
