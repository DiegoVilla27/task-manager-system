package com.diegovilla.task_manager.features.task.application.dto.response;

import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;

public record TaskWithUser(
  TaskModel task,
  UserModel user
) {
}
