package com.diegovilla.task_manager.features.task.infrastructure.controllers;

import java.util.UUID;

import com.diegovilla.task_manager.features.task.application.commands.TaskFiltersCommand;
import com.diegovilla.task_manager.features.task.application.commands.TaskPaginationCommand;
import com.diegovilla.task_manager.features.task.application.dto.response.TaskWithUser;
import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskFiltersDTO;
import com.diegovilla.task_manager.features.task.infrastructure.dto.response.TaskWithUserResponseDTO;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.diegovilla.task_manager.features.task.application.commands.TaskCreateCommand;
import com.diegovilla.task_manager.features.task.application.commands.TaskUpdateCommand;
import com.diegovilla.task_manager.features.task.application.services.TaskService;
import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import com.diegovilla.task_manager.features.task.infrastructure.docs.CompleteTaskDocumentation;
import com.diegovilla.task_manager.features.task.infrastructure.docs.CreateTaskDocumentation;
import com.diegovilla.task_manager.features.task.infrastructure.docs.DeleteTaskDocumentation;
import com.diegovilla.task_manager.features.task.infrastructure.docs.GetTaskDocumentation;
import com.diegovilla.task_manager.features.task.infrastructure.docs.GetTasksDocumentation;
import com.diegovilla.task_manager.features.task.infrastructure.docs.StartTaskDocumentation;
import com.diegovilla.task_manager.features.task.infrastructure.docs.UpdateTaskDocumentation;
import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskCreateRequestDTO;
import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskUpdateRequestDTO;
import com.diegovilla.task_manager.features.task.infrastructure.dto.response.TaskResponseDTO;
import com.diegovilla.task_manager.features.task.infrastructure.mappers.TaskDtoMapper;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller exposing CRUD and lifecycle operations for tasks.
 *
 * <p>
 * All endpoints are mapped under {@code /tasks} and produce/consume
 * JSON. Request validation is enforced through Bean Validation
 * annotations on the incoming DTOs.
 * </p>
 *
 * @since 1.0.0
 */
@Validated
@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Exposes operations for managing tasks, tracking status transitions, and handling task lifecycles within the Task Manager platform.")
public class TaskController {

  private final TaskService taskService;
  private final TaskDtoMapper taskDtoMapper;

  /**
   * Retrieves all tasks in the system.
   *
   * @return HTTP 200 with a list of {@link TaskResponseDTO} instances.
   */
  @GetMapping
  @GetTasksDocumentation
  public ResponseEntity<Page<TaskWithUserResponseDTO>> getAll(
      @RequestParam(defaultValue = "1") @Min(value = 1, message = "Page must be greater than or equal to 0") int page,
      @RequestParam(defaultValue = "10") @Min(value = 1, message = "Limit must be greater than 0") int limit,
      TaskFiltersDTO filters) {
    TaskFiltersCommand taskFiltersCommand = taskDtoMapper.taskFilterDTOToCommand(filters);
    TaskPaginationCommand taskPaginationCommand = new TaskPaginationCommand(page - 1, limit);
    Page<TaskWithUser> tasks = taskService.getAll(taskPaginationCommand, taskFiltersCommand);

    return ResponseEntity.ok(tasks.map(taskDtoMapper::modelToWithUserResponseDTO));
  }

  /**
   * Retrieves a single task by its unique identifier.
   *
   * @param id UUID of the task.
   * @return HTTP 200 with the corresponding {@link TaskResponseDTO}.
   */
  @GetMapping("/{id}")
  @GetTaskDocumentation
  public ResponseEntity<TaskWithUserResponseDTO> getById(@PathVariable UUID id) {
    TaskWithUser response = taskService.getById(id);

    return ResponseEntity.ok(taskDtoMapper.modelToWithUserResponseDTO(response));
  }

  /**
   * Creates a new task.
   *
   * @param dto validated creation request body.
   * @return HTTP 201 with the created {@link TaskResponseDTO}.
   */
  @PostMapping
  @CreateTaskDocumentation
  public ResponseEntity<TaskWithUserResponseDTO> create(
      @Valid @RequestBody TaskCreateRequestDTO dto) {
    TaskCreateCommand command = taskDtoMapper.createRequestDTOToCommand(dto);
    TaskWithUser response = taskService.create(command);

    return ResponseEntity.status(HttpStatus.CREATED).body(
        taskDtoMapper.modelToWithUserResponseDTO(response));
  }

  /**
   * Partially updates an existing task.
   *
   * @param id  UUID of the task to update.
   * @param dto validated partial-update request body.
   * @return HTTP 200 with the updated {@link TaskResponseDTO}.
   */
  @PatchMapping("/{id}")
  @UpdateTaskDocumentation
  public ResponseEntity<TaskWithUserResponseDTO> update(
      @PathVariable UUID id,
      @Valid @RequestBody TaskUpdateRequestDTO dto) {
    TaskUpdateCommand taskUpdateCommand = taskDtoMapper.updateRequestDTOToCommand(dto);
    TaskWithUser response = taskService.update(id, taskUpdateCommand);

    return ResponseEntity.ok().body(
        taskDtoMapper.modelToWithUserResponseDTO(response));
  }

  /**
   * Permanently deletes a task.
   *
   * @param id UUID of the task to delete.
   * @return HTTP 204 with no content.
   */
  @DeleteMapping("/{id}")
  @DeleteTaskDocumentation
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    taskService.delete(id);

    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

  /**
   * Starts a task by transitioning its status to {@code IN_PROGRESS}.
   *
   * @param id UUID of the task to start.
   * @return HTTP 200 with the updated {@link TaskModel}.
   */
  @PatchMapping("/{id}/start")
  @StartTaskDocumentation
  public ResponseEntity<Void> start(@PathVariable UUID id) {
    taskService.start(id);

    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

  /**
   * Completes a task by transitioning its status to {@code COMPLETED}.
   *
   * @param id UUID of the task to complete.
   * @return HTTP 200 with the updated {@link TaskModel}.
   */
  @PatchMapping("/{id}/complete")
  @CompleteTaskDocumentation
  public ResponseEntity<Void> complete(@PathVariable UUID id) {
    taskService.complete(id);

    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }
}
