package com.diegovilla.task_manager.task.application.repository;

import com.diegovilla.task_manager.task.domain.models.TaskModel;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Port defining persistence operations for tasks.
 *
 * <p>This interface belongs to the application layer and is implemented
 * by the infrastructure layer ({@code TaskRepositoryAdapter}), following
 * the Ports and Adapters (Hexagonal) architecture.</p>
 *
 * @since 1.0.0
 */
public interface TaskRepository {

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
  List<TaskModel> getAll();

  /**
   * Retrieves a single task identified by its unique identifier with their associated user information.
   *
   * @param id unique identifier of the task.
   * @return an {@link Optional} containing the task if found, or empty otherwise.
   */
  Optional<TaskModel> getById(UUID id);

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
