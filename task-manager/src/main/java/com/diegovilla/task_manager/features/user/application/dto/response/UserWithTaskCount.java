package com.diegovilla.task_manager.features.user.application.dto.response;

import com.diegovilla.task_manager.features.user.domain.model.UserModel;

/**
 * Application read model projection combining a {@link UserModel} with its total task count.
 *
 * @param user       the user domain entity model.
 * @param countTasks total count of tasks associated with this user.
 * @since 1.0.0
 */
public record UserWithTaskCount(
  UserModel user,
  Long countTasks
) {
}

