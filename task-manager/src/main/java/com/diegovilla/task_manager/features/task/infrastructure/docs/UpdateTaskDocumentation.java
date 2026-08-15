package com.diegovilla.task_manager.features.task.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.BadRequestApiResponse;
import com.diegovilla.task_manager.core.openapi.common.ConflictApiResponse;
import com.diegovilla.task_manager.core.openapi.common.ForbiddenApiResponse;
import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.core.openapi.common.NotFoundApiResponse;
import com.diegovilla.task_manager.core.openapi.common.UnauthorizedApiResponse;
import com.diegovilla.task_manager.features.task.infrastructure.dto.response.TaskWithUserResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.lang.annotation.*;

/**
 * Aggregates the OpenAPI metadata for the <em>Update Task</em> endpoint.
 *
 * @since 1.0.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(summary = "Update task", description = "Partially updates task title or description.")
@ApiResponse(
        responseCode = "200",
        description = "Task updated successfully.",
        content =
                @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = TaskWithUserResponseDTO.class)))
@BadRequestApiResponse
@UnauthorizedApiResponse
@ForbiddenApiResponse
@NotFoundApiResponse
@ConflictApiResponse
@InternalServerErrorApiResponse
public @interface UpdateTaskDocumentation {}
