package com.diegovilla.task_manager.user.infrastructure.errors;

import org.springframework.stereotype.Component;

import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import com.diegovilla.task_manager.core.errors.translators.DatabaseExceptionResolver;
import com.diegovilla.task_manager.user.domain.errors.UserAlreadyExistsException;

@Component
public class UserDatabaseExceptionResolver implements DatabaseExceptionResolver {
  private static final String UK_USERS_EMAIL = "uk_users_email";

  @Override
  public ApiException resolve(String constraintName) {
    if (constraintName != null && constraintName.toLowerCase().contains(UK_USERS_EMAIL)) {
      return new UserAlreadyExistsException();
    }
    return null;
  }
}
