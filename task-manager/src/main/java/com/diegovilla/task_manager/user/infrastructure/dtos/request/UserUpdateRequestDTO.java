package com.diegovilla.task_manager.user.infrastructure.dtos.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Schema(description = "Request body for updating user profile information. All fields are optional.")
public record UserUpdateRequestDTO(

  @Schema(
    description = "Updated first name of the user",
    example = "John",
    requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    minLength = 3,
    maxLength = 100
  )
  @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
  String name,

  @Schema(
    description = "Updated last name of the user",
    example = "Doe",
    requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    minLength = 3,
    maxLength = 100
  )
  @Size(min = 3, max = 100, message = "Last name must be between 3 and 100 characters")
  String lastname,

  @Schema(
    description = "Updated email address for the user account",
    example = "john.updated@example.com",
    requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    maxLength = 150
  )
  @Email(message = "Email has to be valid")
  @Size(max = 150, message = "Email must be at most 150 characters")
  String email
) {
}
