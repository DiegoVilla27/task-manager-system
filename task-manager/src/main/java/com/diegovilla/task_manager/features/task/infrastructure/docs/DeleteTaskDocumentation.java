package com.diegovilla.task_manager.features.task.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.BadRequestApiResponse;
import com.diegovilla.task_manager.core.openapi.common.ForbiddenApiResponse;
import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.core.openapi.common.NotFoundApiResponse;
import com.diegovilla.task_manager.core.openapi.common.UnauthorizedApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.lang.annotation.*;

/**
 * Aggregates the OpenAPI metadata for the <em>Delete Task</em> endpoint.
 *
 * @since 1.0.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(summary = "Delete task", description = "Permanently deletes a task.")
@ApiResponse(responseCode = "204", description = "Task deleted successfully.")
@BadRequestApiResponse
@UnauthorizedApiResponse
@ForbiddenApiResponse
@NotFoundApiResponse
@InternalServerErrorApiResponse
public @interface DeleteTaskDocumentation {}
