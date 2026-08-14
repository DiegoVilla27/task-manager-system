package com.diegovilla.task_manager.features.task.application.ports;

import java.util.Optional;
import java.util.UUID;

import com.diegovilla.task_manager.features.task.application.commands.TaskFiltersCommand;
import com.diegovilla.task_manager.features.task.application.dto.response.TaskWithUser;
import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Outbound persistence port interface for managing {@link TaskModel} entity storage and retrieval.
 *
 * <p>Defines abstraction contracts for persistence adapters, decoupling application logic
 * from concrete database technologies.</p>
 *
 * @since 1.0.0
 */
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
   * Retrieves a paginated list of tasks along with their associated user information.
   *
   * @param pageable pagination configuration containing page number and page size.
   * @param filters  query filter criteria.
   * @return a {@link Page} of {@link TaskWithUser} composite records.
   */
  Page<TaskWithUser> getAll(Pageable pageable, TaskFiltersCommand filters);

  /**
   * Retrieves a single task identified by its unique identifier.
   *
   * @param id unique identifier of the task.
   * @return an {@link Optional} containing the task if found, or empty otherwise.
   */
  Optional<TaskModel> getById(UUID id);

  /**
   * Retrieves a single task by its unique identifier along with associated owner user details.
   *
   * @param id unique identifier of the task.
   * @return an {@link Optional} containing {@link TaskWithUser} if found, or empty otherwise.
   */
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

  /**
   * Permanently removes all tasks belonging to a specific user.
   *
   * @param userId unique identifier (UUID) of the user whose tasks should be deleted.
   */
  void deleteAllByUserId(UUID userId);
}

