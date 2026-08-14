package com.diegovilla.task_manager.features.task.application.services;

import com.diegovilla.task_manager.core.errors.exceptions.DomainException;
import com.diegovilla.task_manager.core.errors.exceptions.ResourceNotFoundException;
import com.diegovilla.task_manager.core.security.jwt.utils.PermissionValidator;
import com.diegovilla.task_manager.features.task.application.commands.TaskCreateCommand;
import com.diegovilla.task_manager.features.task.application.commands.TaskFiltersCommand;
import com.diegovilla.task_manager.features.task.application.commands.TaskPaginationCommand;
import com.diegovilla.task_manager.features.task.application.commands.TaskUpdateCommand;
import com.diegovilla.task_manager.features.task.application.dto.response.TaskWithUser;
import com.diegovilla.task_manager.features.task.application.ports.TaskRepositoryPort;
import com.diegovilla.task_manager.features.task.domain.exceptions.TaskAlreadyExistsException;
import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import com.diegovilla.task_manager.features.user.application.ports.UserRepositoryPort;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.utils.data.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Application service encapsulating the business logic for task management.
 *
 * <p>
 * Orchestrates CRUD operations and status-transition workflows
 * ({@code start}, {@code complete}) by delegating persistence to
 * {@link TaskRepositoryPort} and enforcing domain rules defined in
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

  private final TaskRepositoryPort taskRepositoryPort;
  private final UserRepositoryPort userRepository;
  private final PermissionValidator permissionValidator;

  /**
   * Retrieves a paginated and filtered list of tasks.
   *
   * @param taskPaginationCommand pagination parameters (page index and limit).
   * @param taskFiltersCommand   query filtering parameters (user ID, search keyword, status).
   * @return a {@link Page} of {@link TaskWithUser} composite projections.
   */
  public Page<TaskWithUser> getAll(
    TaskPaginationCommand taskPaginationCommand,
    TaskFiltersCommand taskFiltersCommand
  ) {
    Pageable pageable = PageRequest.of(taskPaginationCommand.page(), taskPaginationCommand.limit());

    // Obtener usuario autenticado y su rol usando tu puerto
    UUID targetUserId = permissionValidator.getTargetUserId(taskFiltersCommand.userId());
    // Crear el objeto de filtros efectivo que viajará al repositorio
    TaskFiltersCommand effectiveFilters = new TaskFiltersCommand(
      targetUserId,
      taskFiltersCommand.search(),
      taskFiltersCommand.status()
    );

    Page<TaskWithUser> tasks = taskRepositoryPort.getAll(pageable, effectiveFilters);
    log.info("Tasks retrieved successfully. size={}", tasks.getContent().size());

    return tasks;
  }

  /**
   * Retrieves a single task by its unique identifier.
   *
   * @param id unique identifier of the task.
   * @return the found {@link TaskModel}.
   * @throws ResourceNotFoundException if no task exists with the given id.
   */
  public TaskWithUser getById(UUID id) {
    TaskWithUser taskFound = taskRepositoryPort
      .getByIdWithUser(id)
      .orElseThrow(() -> new ResourceNotFoundException("Task not found."));

    permissionValidator.validateHasPermissions(taskFound.task().getUserId());

    log.info("Task retrieved successfully. id={}", taskFound.task().getId());

    return taskFound;
  }

  /**
   * Creates a new task after verifying title uniqueness.
   *
   * @param taskCreateCommand domain model representing the new task.
   * @return the persisted {@link TaskWithUser} with generated fields.
   * @throws TaskAlreadyExistsException if a task with the same title
   *                                    already exists (case-insensitive).
   */
  @Transactional
  public TaskWithUser create(TaskCreateCommand taskCreateCommand) {
    permissionValidator.validateHasPermissions(taskCreateCommand.userId());

    if (taskRepositoryPort.existsByTitleIgnoreCase(StringUtils.normalize(taskCreateCommand.title()))) {
      throw new TaskAlreadyExistsException();
    }

    UserModel userFound = getUserById(taskCreateCommand.userId());

    TaskModel taskModel = TaskModel.create(
      taskCreateCommand.title(),
      taskCreateCommand.description(),
      userFound.getId()
    );

    TaskModel taskCreated = taskRepositoryPort.save(taskModel);
    log.info("Task created response successfully. id={}", taskCreated.getId());

    return new TaskWithUser(taskCreated, userFound);
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
  public TaskWithUser update(UUID id, TaskUpdateCommand taskUpdateCommand) {
    TaskWithUser taskFound = getById(id);
    String newTitle = taskUpdateCommand.title();

    if (newTitle != null &&
      !taskFound.task().getTitle().equalsIgnoreCase(newTitle) &&
      taskRepositoryPort.existsByTitleIgnoreCase(
        StringUtils.normalize(newTitle))) {
      throw new TaskAlreadyExistsException();
    }

    taskFound.task().updateInformation(taskUpdateCommand.title(), taskUpdateCommand.description());
    TaskModel taskUpdated = taskRepositoryPort.save(taskFound.task());
    log.info("Task updated successfully. id={}", taskUpdated.getId());

    return taskFound;
  }

  /**
   * Permanently removes a task from the system.
   *
   * @param id unique identifier of the task to delete.
   * @throws ResourceNotFoundException if no task exists with the given id.
   */
  @Transactional
  public void delete(UUID id) {
    TaskWithUser taskFound = getById(id);

    taskRepositoryPort.delete(taskFound.task().getId());
    log.info("Task deleted successfully. id={}", taskFound.task().getId());
  }

  /**
   * Transitions a task to the {@code IN_PROGRESS} status.
   *
   * @param id unique identifier of the task to start.
   * @throws ResourceNotFoundException if no task exists with the given id.
   * @throws DomainException           if the task cannot be started from
   *                                   its current status.
   */
  @Transactional
  public void start(UUID id) {
    TaskWithUser taskFound = getById(id);

    taskFound.task().start();

    TaskModel taskStarted = taskRepositoryPort.save(taskFound.task());
    log.info("Task started successfully. id={}", taskStarted.getId());
  }

  /**
   * Transitions a task to the {@code COMPLETED} status.
   *
   * @param id unique identifier of the task to complete.
   * @throws ResourceNotFoundException if no task exists with the given id.
   * @throws DomainException           if the task cannot be completed from
   *                                   its current status.
   */
  @Transactional
  public void complete(UUID id) {
    TaskWithUser taskFound = getById(id);

    taskFound.task().complete();

    TaskModel taskCompleted = taskRepositoryPort.save(taskFound.task());
    log.info("Task completed successfully. id={}", taskCompleted.getId());
  }

  /**
   * Helper method to retrieve a user model by unique identifier.
   *
   * @param id unique identifier of the user.
   * @return the resolved {@link UserModel}.
   * @throws ResourceNotFoundException if no user exists with the given id.
   */
  private UserModel getUserById(UUID id) {
    return userRepository.getById(id)
      .orElseThrow(() -> new ResourceNotFoundException("User not found.")).user();
  }
}
