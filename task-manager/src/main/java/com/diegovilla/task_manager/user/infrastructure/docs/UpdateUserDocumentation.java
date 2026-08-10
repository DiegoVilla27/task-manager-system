package com.diegovilla.task_manager.user.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.BadRequestApiResponse;
import com.diegovilla.task_manager.core.openapi.common.ConflictApiResponse;
import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.core.openapi.common.NotFoundApiResponse;
import com.diegovilla.task_manager.user.infrastructure.dtos.response.UserResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
  summary = "Update a user",
  description = "Updates one or more fields of an existing user."
)
@Parameter(
  name = "id",
  description = "Unique user identifier.",
  required = true
)
@ApiResponse(
  responseCode = "200",
  description = "User updated successfully.",
  content = @Content(
    mediaType = "application/json",
    schema = @Schema(implementation = UserResponseDTO.class)
  )
)
@BadRequestApiResponse
@NotFoundApiResponse
@ConflictApiResponse
@InternalServerErrorApiResponse
public @interface UpdateUserDocumentation {
}
