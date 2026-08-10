package com.diegovilla.task_manager.features.task.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.BadRequestApiResponse;
import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.core.openapi.common.NotFoundApiResponse;
import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.*;

/**
 * Aggregates the OpenAPI metadata for the <em>Complete Task</em> endpoint.
 *
 * <p>
 * Combines the operation summary, path parameter description,
 * success response schema and standard error responses into a
 * single reusable annotation.
 * </p>
 *
 * @since 1.0.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(summary = "Complete a task", description = "Marks a task as completed by setting its status to COMPLETED.")
@Parameter(name = "id", description = "Unique task identifier.", required = true)
@ApiResponse(responseCode = "200", description = "Task completed successfully.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = TaskModel.class)))
@BadRequestApiResponse
@NotFoundApiResponse
@InternalServerErrorApiResponse
public @interface CompleteTaskDocumentation {
}
