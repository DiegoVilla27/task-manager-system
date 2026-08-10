package com.diegovilla.task_manager.features.task.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.core.openapi.common.NotFoundApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.*;

/**
 * Aggregates the OpenAPI metadata for the <em>Delete Task</em> endpoint.
 *
 * <p>
 * Combines the operation summary, path parameter description and
 * standard error responses into a single reusable annotation.
 * </p>
 *
 * @since 1.0.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(summary = "Delete a task", description = "Permanently deletes a task from the system.")
@Parameter(name = "id", description = "Unique task identifier.", required = true)
@ApiResponse(responseCode = "204", description = "Task deleted successfully.")
@NotFoundApiResponse
@InternalServerErrorApiResponse
public @interface DeleteTaskDocumentation {
}
