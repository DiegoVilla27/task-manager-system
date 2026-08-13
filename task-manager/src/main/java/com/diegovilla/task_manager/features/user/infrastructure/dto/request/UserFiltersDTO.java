package com.diegovilla.task_manager.features.user.infrastructure.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "Query parameter filters for searching and paginating users")
public record UserFiltersDTO(
  @Schema(description = "Search keyword matching first name or last name", example = "John")
  String search,

  @Schema(description = "User unique identifier constraint", example = "123e4567-e89b-12d3-a456-426655440000")
  UUID userId
) {
}
