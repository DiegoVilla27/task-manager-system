package com.diegovilla.task_manager.task.application;

import com.diegovilla.task_manager.core.errors.exceptions.ResourceNotFoundException;
import com.diegovilla.task_manager.task.application.commands.TaskCreateCommand;
import com.diegovilla.task_manager.task.application.commands.TaskUpdateCommand;
import com.diegovilla.task_manager.task.application.repository.TaskRepository;
import com.diegovilla.task_manager.task.application.services.TaskService;
import com.diegovilla.task_manager.task.domain.enums.TaskStatus;
import com.diegovilla.task_manager.task.domain.errors.TaskAlreadyExistsException;
import com.diegovilla.task_manager.task.domain.models.TaskModel;
import com.diegovilla.task_manager.user.application.repository.UserRepository;
import com.diegovilla.task_manager.user.domain.models.UserModel;
import com.diegovilla.task_manager.utils.data.StringUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

  @Mock
  private TaskRepository taskRepository;

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private TaskService taskService;

  private final UserModel user = UserModel.create(
    "John",
    "Doe",
    "john.doe@example.com",
    "hash_1234"
  );

  @Test
  @DisplayName("Should retrieve all tasks successfully")
  void shouldGetAllTasks() {
    List<TaskModel> tasks = List.of(
      TaskModel.create("Task 1", "Description 1", user),
      TaskModel.create("Task 2", "Description 2", user)
    );

    when(taskRepository.getAll()).thenReturn(tasks);

    List<TaskModel> tasksResponse = taskService.getAll();

    assertThat(tasksResponse).isSameAs(tasks);
    verify(taskRepository).getAll();
  }

  @Test
  @DisplayName("Should retrieve a task by its ID successfully")
  void shouldGetUserById() {
    TaskModel task = TaskModel.create("Task 1", "Description 1", user);

    when(taskRepository.getById(task.getId())).thenReturn(Optional.of(task));

    TaskModel taskFound = taskService.getById(task.getId());

    assertThat(taskFound).isSameAs(task);
    verify(taskRepository).getById(task.getId());
  }

  @Test
  @DisplayName("Should reject retrieval of a task by ID if it does not exist")
  void shouldRejectGetUserByIdNotFound() {
    UUID id = UUID.randomUUID();

    when(taskRepository.getById(id)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> taskService.getById(id))
      .isInstanceOf(ResourceNotFoundException.class)
      .hasMessage("Task not found.");

    verify(taskRepository).getById(id);
  }

  @Test
  @DisplayName("Should create a task successfully when it does not already exist")
  void shouldCreateTaskSuccessfully() {
    TaskCreateCommand command = new TaskCreateCommand(
      "Test Task",
      "This is a test task",
      UUID.randomUUID()
    );

    when(taskRepository.existsByTitleIgnoreCase(StringUtils.normalize(command.title())))
      .thenReturn(false);

    when(userRepository.getById(command.userId()))
      .thenReturn(Optional.of(user));

    /*
     * thenAnswer: invocation.getArgument(0) toma el objeto exacto que el servicio
     * acaba de crear internamente y lo devuelve. Así garantizas que la prueba
     * valide lo que realmente se procesó.
     */
    when(taskRepository.save(any(TaskModel.class)))
      .thenAnswer(invocation -> invocation.getArgument(0));

    TaskModel taskCreated = taskService.create(command);

    assertThat(taskCreated).isNotNull();
    assertThat(taskCreated.getTitle()).isEqualTo(command.title());
    assertThat(taskCreated.getDescription()).isEqualTo(command.description());

    verify(taskRepository).existsByTitleIgnoreCase(StringUtils.normalize(command.title()));
    verify(userRepository).getById(command.userId());
    verify(taskRepository).save(any(TaskModel.class));
  }

  @Test
  @DisplayName("Should reject task creation if a task with the same title already exists")
  void shouldRejectCreateTaskIfAlreadyExists() {
    TaskCreateCommand command = new TaskCreateCommand(
      "Test Task",
      "This is a test task",
      UUID.randomUUID()
    );

    when(taskRepository.existsByTitleIgnoreCase(StringUtils.normalize(command.title())))
      .thenReturn(true);

    assertThatThrownBy(() -> taskService.create(command))
      .isInstanceOf(TaskAlreadyExistsException.class)
      .hasMessage("A task with this title already exists.");

    verify(taskRepository).existsByTitleIgnoreCase(StringUtils.normalize(command.title()));
    verify(taskRepository, never()).save(any());
  }

  @Test
  @DisplayName("Should update a task successfully")
  void shouldUpdateTask() {
    UUID taskId = UUID.randomUUID();
    TaskUpdateCommand command = new TaskUpdateCommand(
      "Test 1 Task",
      null
    );
    TaskModel taskFound = TaskModel.reconstruct(
      taskId,
      "Task 1",
      "Task Desc 1",
      TaskStatus.PENDING,
      user,
      Instant.now(),
      Instant.now()
    );

    when(taskRepository.getById(taskId)).thenReturn(Optional.of(taskFound));

    when(taskRepository.existsByTitleIgnoreCase(StringUtils.normalize(command.title()))).thenReturn(false);

    when(taskRepository.save(taskFound)).thenReturn(taskFound);

    TaskModel taskUpdated = taskService.update(taskId, command);

    assertThat(taskUpdated.getTitle()).isEqualTo(command.title());
    assertThat(taskUpdated.getDescription()).isEqualTo(taskFound.getDescription());

    verify(taskRepository).getById(taskId);
    verify(taskRepository).existsByTitleIgnoreCase(StringUtils.normalize(command.title()));
    verify(taskRepository).save(taskFound);
  }

  @Test
  @DisplayName("Should reject task update if a task with the new title already exists")
  void shouldRejectUpdateTaskIfTitleExists() {
    UUID taskId = UUID.randomUUID();
    TaskUpdateCommand command = new TaskUpdateCommand(
      "Test 1 Task",
      null
    );
    TaskModel taskFound = TaskModel.reconstruct(
      taskId,
      "Task 1",
      "Task Desc 1",
      TaskStatus.PENDING,
      user,
      Instant.now(),
      Instant.now()
    );

    when(taskRepository.getById(taskId)).thenReturn(Optional.of(taskFound));

    when(taskRepository.existsByTitleIgnoreCase(StringUtils.normalize(command.title()))).thenReturn(true);

    assertThatThrownBy(() -> taskService.update(taskId, command))
      .isInstanceOf(TaskAlreadyExistsException.class)
      .hasMessage("A task with this title already exists.");

    verify(taskRepository).getById(taskId);
    verify(taskRepository).existsByTitleIgnoreCase(StringUtils.normalize(command.title()));
    verify(taskRepository, never()).save(any());
  }

  @Test
  @DisplayName("Should delete a task successfully")
  void shouldDeleteTaskSuccessfully() {
    UUID taskId = UUID.randomUUID();
    TaskModel taskFound = TaskModel.reconstruct(
      taskId,
      "Task 1",
      "Task Desc 1",
      TaskStatus.PENDING,
      user,
      Instant.now(),
      Instant.now()
    );

    when(taskRepository.getById(taskId)).thenReturn(Optional.of(taskFound));

    doNothing().when(taskRepository).delete(taskId);

    taskService.delete(taskId);

    verify(taskRepository).getById(taskId);
    verify(taskRepository).delete(taskId);
  }

  @Test
  @DisplayName("Should start a task successfully")
  void shouldStartTaskSuccessfully() {
    UUID taskId = UUID.randomUUID();
    TaskModel taskFound = TaskModel.reconstruct(
      taskId,
      "Task 1",
      "Task Desc 1",
      TaskStatus.PENDING,
      user,
      Instant.now(),
      Instant.now()
    );

    when(taskRepository.getById(taskId)).thenReturn(Optional.of(taskFound));

    when(taskRepository.save(taskFound)).thenReturn(taskFound);

    TaskModel taskStarted = taskService.start(taskId);

    assertThat(taskStarted.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);

    verify(taskRepository).getById(taskId);
    verify(taskRepository).save(taskFound);
  }

  @Test
  void shouldCompleteTaskSuccessfully() {
    UUID taskId = UUID.randomUUID();
    TaskModel taskFound = TaskModel.reconstruct(
      taskId,
      "Task 1",
      "Task Desc 1",
      TaskStatus.IN_PROGRESS,
      user,
      Instant.now(),
      Instant.now()
    );

    when(taskRepository.getById(taskId)).thenReturn(Optional.of(taskFound));
    when(taskRepository.save(taskFound)).thenReturn(taskFound);

    TaskModel taskCompleted = taskService.complete(taskId);

    assertThat(taskCompleted.getStatus()).isEqualTo(TaskStatus.COMPLETED);

    verify(taskRepository).getById(taskId);
    verify(taskRepository).save(taskFound);
  }
}
