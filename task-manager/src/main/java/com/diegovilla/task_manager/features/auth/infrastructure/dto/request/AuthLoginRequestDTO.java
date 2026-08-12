package com.diegovilla.task_manager.features.auth.infrastructure.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthLoginRequestDTO(
  @Email(message = "Email has to be valid")
  @Size(max = 150, message = "Email must be at most 150 characters")
  String email,
  @NotBlank(message = "Password is required")
  @Size(max = 50, message = "must be at most 50 characters")
  String password
) {
}
