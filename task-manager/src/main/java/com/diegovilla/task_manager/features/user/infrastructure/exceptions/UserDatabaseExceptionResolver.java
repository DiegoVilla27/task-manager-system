package com.diegovilla.task_manager.features.user.infrastructure.exceptions;

import com.diegovilla.task_manager.features.user.domain.exceptions.UserHasAssociatedTasksException;
import org.springframework.stereotype.Component;

import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import com.diegovilla.task_manager.core.errors.translators.DatabaseExceptionResolver;
import com.diegovilla.task_manager.features.user.domain.exceptions.UserAlreadyExistsException;

@Component
public class UserDatabaseExceptionResolver implements DatabaseExceptionResolver {
  private static final String UK_USERS_EMAIL = "uk_users_email";
  private static final String FK_TASKS_USER = "fk6s1ob9k4ihi75xbxe2w0ylsdh";

  @Override
  public ApiException resolve(String constraintName) {
    if (constraintName == null) {
      return null;
    }

    String lowerConstraint = constraintName.toLowerCase();
    if (lowerConstraint.contains(UK_USERS_EMAIL)) {
      return new UserAlreadyExistsException();
    }

    if (lowerConstraint.contains(FK_TASKS_USER)) {
      return new UserHasAssociatedTasksException();
    }

    return null;
  }
}
