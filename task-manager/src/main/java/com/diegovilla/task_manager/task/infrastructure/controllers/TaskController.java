package com.diegovilla.task_manager.task.infrastructure.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diegovilla.task_manager.task.application.commands.TaskCreateCommand;
import com.diegovilla.task_manager.task.application.commands.TaskUpdateCommand;
import com.diegovilla.task_manager.task.application.services.TaskService;
import com.diegovilla.task_manager.task.domain.models.TaskModel;
import com.diegovilla.task_manager.task.infrastructure.docs.CompleteTaskDocumentation;
import com.diegovilla.task_manager.task.infrastructure.docs.CreateTaskDocumentation;
import com.diegovilla.task_manager.task.infrastructure.docs.DeleteTaskDocumentation;
import com.diegovilla.task_manager.task.infrastructure.docs.GetTaskDocumentation;
import com.diegovilla.task_manager.task.infrastructure.docs.GetTasksDocumentation;
import com.diegovilla.task_manager.task.infrastructure.docs.StartTaskDocumentation;
import com.diegovilla.task_manager.task.infrastructure.docs.UpdateTaskDocumentation;
import com.diegovilla.task_manager.task.infrastructure.dtos.request.TaskCreateRequestDTO;
import com.diegovilla.task_manager.task.infrastructure.dtos.request.TaskUpdateRequestDTO;
import com.diegovilla.task_manager.task.infrastructure.dtos.response.TaskResponseDTO;
import com.diegovilla.task_manager.task.infrastructure.mappers.TaskDtoMapper;

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
  public ResponseEntity<List<TaskResponseDTO>> getAll() {
    List<TaskModel> tasks = taskService.getAll();

    return ResponseEntity.ok(tasks
        .stream()
        .map(taskDtoMapper::modelToResponseDTO)
        .toList());
  }

  /**
   * Retrieves a single task by its unique identifier.
   *
   * @param id UUID of the task.
   * @return HTTP 200 with the corresponding {@link TaskResponseDTO}.
   */
  @GetMapping("/{id}")
  @GetTaskDocumentation
  public ResponseEntity<TaskResponseDTO> getById(@PathVariable UUID id) {
    TaskModel task = taskService.getById(id);

    return ResponseEntity.ok(taskDtoMapper.modelToResponseDTO(task));
  }

  /**
   * Creates a new task.
   *
   * @param dto validated creation request body.
   * @return HTTP 201 with the created {@link TaskResponseDTO}.
   */
  @PostMapping
  @CreateTaskDocumentation
  public ResponseEntity<TaskResponseDTO> create(
      @Valid @RequestBody TaskCreateRequestDTO dto) {
    TaskCreateCommand command = taskDtoMapper.createRequestDTOToCommand(dto);
    TaskModel taskCreated = taskService.create(command);

    return ResponseEntity.status(HttpStatus.CREATED).body(
        taskDtoMapper.modelToResponseDTO(taskCreated));
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
  public ResponseEntity<TaskResponseDTO> update(
      @PathVariable UUID id,
      @Valid @RequestBody TaskUpdateRequestDTO dto) {
    TaskUpdateCommand taskUpdateCommand = taskDtoMapper.updateRequestDTOToCommand(dto);
    TaskModel taskUpdated = taskService.update(id, taskUpdateCommand);

    return ResponseEntity.ok().body(
        taskDtoMapper.modelToResponseDTO(taskUpdated));
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
  public ResponseEntity<TaskResponseDTO> start(@PathVariable UUID id) {
    TaskModel taskStarted = taskService.start(id);

    return ResponseEntity.ok().body(taskDtoMapper.modelToResponseDTO(taskStarted));
  }

  /**
   * Completes a task by transitioning its status to {@code COMPLETED}.
   *
   * @param id UUID of the task to complete.
   * @return HTTP 200 with the updated {@link TaskModel}.
   */
  @PatchMapping("/{id}/complete")
  @CompleteTaskDocumentation
  public ResponseEntity<TaskResponseDTO> complete(@PathVariable UUID id) {
    TaskModel taskCompleted = taskService.complete(id);

    return ResponseEntity.ok().body(taskDtoMapper.modelToResponseDTO(taskCompleted));
  }
}
