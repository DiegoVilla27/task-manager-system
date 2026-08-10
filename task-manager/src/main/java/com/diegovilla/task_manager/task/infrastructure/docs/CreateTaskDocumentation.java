package com.diegovilla.task_manager.task.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.BadRequestApiResponse;
import com.diegovilla.task_manager.core.openapi.common.ConflictApiResponse;
import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.task.infrastructure.dtos.response.TaskResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.*;

/**
 * Aggregates the OpenAPI metadata for the <em>Create Task</em> endpoint.
 *
 * <p>Combines the operation summary, success response schema and
 * standard error responses into a single reusable annotation.</p>
 *
 * @since 1.0.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
  summary = "Create a task",
  description = "Creates a new task in the system."
)
@ApiResponse(
  responseCode = "201",
  description = "Task created successfully.",
  content = @Content(
    mediaType = "application/json",
    schema = @Schema(implementation = TaskResponseDTO.class)
  )
)
@BadRequestApiResponse
@ConflictApiResponse
@InternalServerErrorApiResponse
public @interface CreateTaskDocumentation {
}

