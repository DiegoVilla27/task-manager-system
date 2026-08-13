package com.diegovilla.task_manager.features.user.application.commands;

import java.util.UUID;

public record UserFiltersCommand(
  String search,
  UUID userId
) {
}
