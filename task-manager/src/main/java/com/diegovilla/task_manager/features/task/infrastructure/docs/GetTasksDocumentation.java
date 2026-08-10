package com.diegovilla.task_manager.features.task.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.features.task.infrastructure.dto.response.TaskResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.*;

/**
 * Aggregates the OpenAPI metadata for the <em>Get All Tasks</em> endpoint.
 *
 * <p>
 * Combines the operation summary, success response array schema
 * and standard error responses into a single reusable annotation.
 * </p>
 *
 * @since 1.0.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(summary = "Retrieve all tasks", description = "Returns the complete list of tasks.")
@ApiResponse(responseCode = "200", description = "Tasks retrieved successfully.", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = TaskResponseDTO.class))))
@InternalServerErrorApiResponse
public @interface GetTasksDocumentation {
}
