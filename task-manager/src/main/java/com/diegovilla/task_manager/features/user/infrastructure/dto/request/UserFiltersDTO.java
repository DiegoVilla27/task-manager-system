package com.diegovilla.task_manager.features.user.infrastructure.dto.request;

import java.util.UUID;

public record UserFiltersDTO(
  String search,
  UUID userId
) {
}
