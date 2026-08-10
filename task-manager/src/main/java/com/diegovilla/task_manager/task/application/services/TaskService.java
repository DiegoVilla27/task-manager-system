package com.diegovilla.task_manager.task.application.services;

import com.diegovilla.task_manager.core.errors.exceptions.DomainException;
import com.diegovilla.task_manager.core.errors.exceptions.ResourceNotFoundException;
import com.diegovilla.task_manager.task.application.commands.TaskCreateCommand;
import com.diegovilla.task_manager.task.application.commands.TaskUpdateCommand;
import com.diegovilla.task_manager.task.application.repository.TaskRepository;
import com.diegovilla.task_manager.task.domain.errors.TaskAlreadyExistsException;
import com.diegovilla.task_manager.task.domain.models.TaskModel;
import com.diegovilla.task_manager.user.application.repository.UserRepository;
import com.diegovilla.task_manager.user.domain.models.UserModel;
import com.diegovilla.task_manager.utils.data.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Application service encapsulating the business logic for task management.
 *
 * <p>
 * Orchestrates CRUD operations and status-transition workflows
 * ({@code start}, {@code complete}) by delegating persistence to
 * {@link TaskRepository} and enforcing domain rules defined in
 * {@link TaskModel}.
 * </p>
 *
 * <p>
 * Read-only operations execute within a read-only transaction;
 * write operations use a standard read-write transaction.
 * </p>
 *
 * @since 1.0.0
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

  private final TaskRepository taskRepository;
  private final UserRepository userRepository;

  /**
   * Retrieves every task in the system.
   *
   * @return a list containing all {@link TaskModel} instances.
   */
  public List<TaskModel> getAll() {
    List<TaskModel> tasks = taskRepository.getAll();
    log.info("Tasks retrieved successfully. size={}", tasks.size());

    return tasks;
  }

  /**
   * Retrieves a single task by its unique identifier.
   *
   * @param id unique identifier of the task.
   * @return the found {@link TaskModel}.
   * @throws ResourceNotFoundException if no task exists with the given id.
   */
  public TaskModel getById(UUID id) {
    TaskModel taskFound = taskRepository
      .getById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Task not found."));
    log.info("Task retrieved successfully. id={}", taskFound.getId());

    return taskFound;
  }

  /**
   * Creates a new task after verifying title uniqueness.
   *
   * @param taskModel domain model representing the new task.
   * @return the persisted {@link TaskModel} with generated fields.
   * @throws TaskAlreadyExistsException if a task with the same title
   *                                    already exists (case-insensitive).
   */
  @Transactional
  public TaskModel create(TaskCreateCommand taskCreateCommand) {
    if (taskRepository.existsByTitleIgnoreCase(StringUtils.normalize(taskCreateCommand.title()))) {
      throw new TaskAlreadyExistsException();
    }

    UserModel userFound = userRepository.getById(taskCreateCommand.userId())
      .orElseThrow(() -> new ResourceNotFoundException("User not found."));

    TaskModel taskModel = TaskModel.create(
      taskCreateCommand.title(),
      taskCreateCommand.description(),
      userFound);

    TaskModel taskCreated = taskRepository.save(taskModel);
    log.info("Task created successfully. id={}", taskCreated.getId());

    return taskCreated;
  }

  /**
   * Partially updates an existing task.
   *
   * <p>
   * If the title is being changed, uniqueness is re-validated
   * before applying the update.
   * </p>
   *
   * @param id                unique identifier of the task to update.
   * @param taskUpdateCommand command containing the fields to update.
   * @return the updated {@link TaskModel}.
   * @throws ResourceNotFoundException  if no task exists with the given id.
   * @throws TaskAlreadyExistsException if the new title collides with
   *                                    an existing task.
   */
  @Transactional
  public TaskModel update(UUID id, TaskUpdateCommand taskUpdateCommand) {
    TaskModel taskFound = getById(id);
    String newTitle = taskUpdateCommand.title();

    if (newTitle != null &&
      !taskFound.getTitle().equalsIgnoreCase(newTitle) &&
      taskRepository.existsByTitleIgnoreCase(
        StringUtils.normalize(newTitle))) {
      throw new TaskAlreadyExistsException();
    }

    taskFound.updateInformation(taskUpdateCommand.title(), taskUpdateCommand.description());
    TaskModel taskUpdated = taskRepository.save(taskFound);
    log.info("Task updated successfully. id={}", taskUpdated.getId());

    return taskUpdated;
  }

  /**
   * Permanently removes a task from the system.
   *
   * @param id unique identifier of the task to delete.
   * @throws ResourceNotFoundException if no task exists with the given id.
   */
  @Transactional
  public void delete(UUID id) {
    TaskModel taskFound = getById(id);

    taskRepository.delete(taskFound.getId());
    log.info("Task deleted successfully. id={}", taskFound.getId());
  }

  /**
   * Transitions a task to the {@code IN_PROGRESS} status.
   *
   * @param id unique identifier of the task to start.
   * @return the updated {@link TaskModel} with status {@code IN_PROGRESS}.
   * @throws ResourceNotFoundException if no task exists with the given id.
   * @throws DomainException           if the task cannot be started from
   *                                   its current status.
   */
  @Transactional
  public TaskModel start(UUID id) {
    TaskModel taskFound = getById(id);

    taskFound.start();

    TaskModel taskStarted = taskRepository.save(taskFound);
    log.info("Task started successfully. id={}", taskStarted.getId());

    return taskStarted;
  }

  /**
   * Transitions a task to the {@code COMPLETED} status.
   *
   * @param id unique identifier of the task to complete.
   * @return the updated {@link TaskModel} with status {@code COMPLETED}.
   * @throws ResourceNotFoundException if no task exists with the given id.
   * @throws DomainException           if the task cannot be completed from
   *                                   its current status.
   */
  @Transactional
  public TaskModel complete(UUID id) {
    TaskModel taskFound = getById(id);

    taskFound.complete();

    TaskModel taskCompleted = taskRepository.save(taskFound);
    log.info("Task completed successfully. id={}", taskCompleted.getId());

    return taskCompleted;
  }
}
