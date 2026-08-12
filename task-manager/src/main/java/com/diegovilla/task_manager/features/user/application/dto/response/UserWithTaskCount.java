package com.diegovilla.task_manager.features.user.application.dto.response;

import com.diegovilla.task_manager.features.user.domain.model.UserModel;

public record UserWithTaskCount(
  UserModel user,
  Long countTasks
) {
}
