package com.diegovilla.task_manager.features.task.infrastructure.exceptions;

import org.springframework.stereotype.Component;

import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import com.diegovilla.task_manager.core.errors.translators.DatabaseExceptionResolver;
import com.diegovilla.task_manager.features.task.domain.exceptions.TaskAlreadyExistsException;

/**
 * Infrastructure database exception resolver for task-related constraint violations.
 *
 * <p>Translates relational database unique key constraint violations (e.g. {@code uk_tasks_title})
 * into domain-specific {@link TaskAlreadyExistsException} instances.</p>
 *
 * @since 1.0.0
 */
@Component
public class TaskDatabaseExceptionResolver implements DatabaseExceptionResolver {
  private static final String UK_TASKS_TITLE = "uk_tasks_title";

  /**
   * Translates a constraint name into a domain exception if it matches task constraints.
   *
   * @param constraintName the database constraint name extracted from exception.
   * @return a {@link TaskAlreadyExistsException} if matching, or {@code null} otherwise.
   */
  @Override
  public ApiException resolve(String constraintName) {
    if (constraintName != null && constraintName.toLowerCase().contains(UK_TASKS_TITLE)) {
      return new TaskAlreadyExistsException();
    }
    return null;
  }
}