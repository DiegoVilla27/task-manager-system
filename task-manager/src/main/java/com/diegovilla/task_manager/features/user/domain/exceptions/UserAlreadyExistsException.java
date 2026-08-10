package com.diegovilla.task_manager.features.user.domain.exceptions;

import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import org.springframework.http.HttpStatus;

public class UserAlreadyExistsException extends ApiException {

  public UserAlreadyExistsException() {
    super(HttpStatus.CONFLICT, "A user with this email already exists.");
  }
}
