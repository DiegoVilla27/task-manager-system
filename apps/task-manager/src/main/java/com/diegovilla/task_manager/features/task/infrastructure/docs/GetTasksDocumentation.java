package com.diegovilla.task_manager.features.task.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.BadRequestApiResponse;
import com.diegovilla.task_manager.core.openapi.common.ForbiddenApiResponse;
import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.core.openapi.common.UnauthorizedApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.lang.annotation.*;

/**
 * Aggregates the OpenAPI metadata for the <em>Get All Tasks</em> endpoint.
 *
 * <p>Documents the {@code GET /tasks} operation which retrieves a paginated list of tasks filtered
 * by optional query criteria (status, keyword search, user ID).
 *
 * @since 1.0.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Get all tasks",
        description = "Retrieves a paginated list of tasks filtered by optional query criteria.")
@ApiResponse(
        responseCode = "200",
        description = "Tasks retrieved successfully as a paginated collection.")
@BadRequestApiResponse
@UnauthorizedApiResponse
@ForbiddenApiResponse
@InternalServerErrorApiResponse
public @interface GetTasksDocumentation {}
