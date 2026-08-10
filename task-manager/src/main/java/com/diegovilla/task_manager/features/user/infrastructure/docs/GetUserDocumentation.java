package com.diegovilla.task_manager.features.user.infrastructure.docs;

import com.diegovilla.task_manager.core.openapi.common.InternalServerErrorApiResponse;
import com.diegovilla.task_manager.core.openapi.common.NotFoundApiResponse;
import com.diegovilla.task_manager.core.openapi.common.UnauthorizedApiResponse;
import com.diegovilla.task_manager.features.user.infrastructure.dto.response.UserResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(summary = "Retrieve a user", description = "Returns the information of a specific user identified by its UUID.")
@Parameter(name = "id", description = "Unique user identifier.", required = true)
@ApiResponse(responseCode = "200", description = "User retrieved successfully.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserResponseDTO.class)))
@NotFoundApiResponse
@UnauthorizedApiResponse
@InternalServerErrorApiResponse
public @interface GetUserDocumentation {
}
