package com.diegovilla.task_manager.features.user.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.ConflictApiResponse;
import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.core.openapi.common.NotFoundApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(summary = "Delete a user", description = "Permanently deletes a user from the system.")
@Parameter(name = "id", description = "Unique user identifier.", required = true)
@ApiResponse(responseCode = "204", description = "User deleted successfully.")
@NotFoundApiResponse
@ConflictApiResponse
@InternalServerErrorApiResponse
public @interface DeleteUserDocumentation {
}
