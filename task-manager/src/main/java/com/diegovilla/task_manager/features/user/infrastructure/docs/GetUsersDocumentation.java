package com.diegovilla.task_manager.features.user.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.BadRequestApiResponse;
import com.diegovilla.task_manager.core.openapi.common.ForbiddenApiResponse;
import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.core.openapi.common.UnauthorizedApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.*;

/**
 * Aggregates OpenAPI metadata for the <em>Get All Users</em> endpoint.
 *
 * <p>Documents the {@code GET /users} operation which retrieves a paginated
 * list of user accounts with calculated task statistics, restricted to administrators.</p>
 *
 * @since 1.0.0
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
  summary = "Get all users",
  description = "Retrieves a paginated list of users filtered by optional query criteria. Requires administrator privileges."
)
@ApiResponse(
  responseCode = "200",
  description = "Users retrieved successfully as a paginated collection."
)
@BadRequestApiResponse
@UnauthorizedApiResponse
@ForbiddenApiResponse
@InternalServerErrorApiResponse
public @interface GetUsersDocumentation {
}
