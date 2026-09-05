package com.diegovilla.task_manager.features.user.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.BadRequestApiResponse;
import com.diegovilla.task_manager.core.openapi.common.ForbiddenApiResponse;
import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.core.openapi.common.NotFoundApiResponse;
import com.diegovilla.task_manager.core.openapi.common.UnauthorizedApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.lang.annotation.*;

/**
 * OpenAPI documentation annotation for the user deletion endpoint ({@code DELETE /users/{id}}).
 *
 * <p>Documents HTTP 204 No Content and standard error response schemas.
 *
 * @since 1.0.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(summary = "Delete user", description = "Permanently deletes a user account.")
@ApiResponse(responseCode = "204", description = "User deleted successfully.")
@BadRequestApiResponse
@UnauthorizedApiResponse
@ForbiddenApiResponse
@NotFoundApiResponse
@InternalServerErrorApiResponse
public @interface DeleteUserDocumentation {}
