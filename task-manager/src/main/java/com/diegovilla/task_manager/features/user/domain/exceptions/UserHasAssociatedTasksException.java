package com.diegovilla.task_manager.features.user.domain.exceptions;

import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import org.springframework.http.HttpStatus;

public class UserHasAssociatedTasksException extends ApiException {
  public UserHasAssociatedTasksException() {
    super(HttpStatus.CONFLICT, "Cannot delete user because they have associated tasks.");
  }
}
