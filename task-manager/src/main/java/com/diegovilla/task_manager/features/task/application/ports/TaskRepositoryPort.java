package com.diegovilla.task_manager.features.task.application.ports;

import java.util.Optional;
import java.util.UUID;

import com.diegovilla.task_manager.features.task.application.dto.response.TaskWithUser;
import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskFiltersDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskRepositoryPort {

  /**
   * Checks whether a task with the given title already exists,
   * performing a case-insensitive comparison.
   *
   * @param title normalized title to check.
   * @return {@code true} if a matching task exists; {@code false} otherwise.
   */
  boolean existsByTitleIgnoreCase(String title);

  /**
   * Retrieves all tasks along with their associated user information.
   *
   * @return a list of {@link TaskModel} instances, each containing user details.
   */
  Page<TaskWithUser> getAll(Pageable pageable, TaskFiltersDTO filters);

  /**
   * Retrieves a single task identified by its unique identifier with their
   * associated user information.
   *
   * @param id unique identifier of the task.
   * @return an {@link Optional} containing the task if found, or empty otherwise.
   */
  Optional<TaskModel> getById(UUID id);

  Optional<TaskWithUser> getByIdWithUser(UUID id);

  /**
   * Persists a new or updated task.
   *
   * @param taskModel domain model representing the task to persist.
   * @return the persisted {@link TaskModel} with any generated fields populated.
   */
  TaskModel save(TaskModel taskModel);

  /**
   * Permanently removes a task by its unique identifier.
   *
   * @param id unique identifier of the task to delete.
   */
  void delete(UUID id);
}
