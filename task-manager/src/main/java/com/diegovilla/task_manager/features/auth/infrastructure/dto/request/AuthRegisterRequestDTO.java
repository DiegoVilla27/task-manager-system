package com.diegovilla.task_manager.features.auth.infrastructure.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthRegisterRequestDTO(
  @NotBlank(message = "Name is required")
  @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
  String name,

  @Size(min = 3, max = 100, message = "Last name must be between 3 and 100 characters")
  String lastname,

  @NotBlank(message = "Email is required")
  @Email(message = "Email has to be valid")
  @Size(max = 150, message = "Email must be at most 150 characters")
  String email,

  @NotBlank(message = "Password is required")
  @Size(min = 8, max = 20, message = "Password must be between 8 and 20 characters")
  String password
) {
}
