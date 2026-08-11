package com.diegovilla.task_manager.features.task.application.dto.response;

import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;

/**
 * Application read model projection combining a {@link TaskModel} with its associated owner {@link UserModel}.
 *
 * <p>Used across application services and infrastructure adapters to transport composite task and user
 * domain data without directly coupling the Task domain aggregate to the User domain aggregate.</p>
 *
 * @param task the task domain model.
 * @param user the user domain model representing the task owner.
 * @since 1.0.0
 */
public record TaskWithUser(
  TaskModel task,
  UserModel user
) {
}
