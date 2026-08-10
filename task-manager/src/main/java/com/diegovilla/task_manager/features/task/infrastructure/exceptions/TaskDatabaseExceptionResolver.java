package com.diegovilla.task_manager.features.task.infrastructure.exceptions;

import org.springframework.stereotype.Component;

import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import com.diegovilla.task_manager.core.errors.translators.DatabaseExceptionResolver;
import com.diegovilla.task_manager.features.task.domain.exceptions.TaskAlreadyExistsException;

@Component
public class TaskDatabaseExceptionResolver implements DatabaseExceptionResolver {
  private static final String UK_TASKS_TITLE = "uk_tasks_title";

  @Override
  public ApiException resolve(String constraintName) {
    if (constraintName != null && constraintName.toLowerCase().contains(UK_TASKS_TITLE)) {
      return new TaskAlreadyExistsException();
    }
    return null;
  }
}