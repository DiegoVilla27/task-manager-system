package com.diegovilla.task_manager.features.task.application;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.diegovilla.task_manager.core.errors.exceptions.ResourceNotFoundException;
import com.diegovilla.task_manager.features.task.application.commands.TaskCreateCommand;
import com.diegovilla.task_manager.features.task.application.commands.TaskFiltersCommand;
import com.diegovilla.task_manager.features.task.application.commands.TaskPaginationCommand;
import com.diegovilla.task_manager.features.task.application.commands.TaskUpdateCommand;
import com.diegovilla.task_manager.features.task.application.dto.response.TaskWithUser;
import com.diegovilla.task_manager.features.task.application.ports.TaskRepositoryPort;
import com.diegovilla.task_manager.features.task.application.services.TaskService;
import com.diegovilla.task_manager.features.task.domain.exceptions.TaskAlreadyExistsException;
import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;
import com.diegovilla.task_manager.features.user.application.dto.response.UserWithTaskCount;
import com.diegovilla.task_manager.features.user.application.ports.UserRepositoryPort;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.domain.valueobjects.UserRole;
import com.diegovilla.task_manager.utils.data.StringUtils;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock private TaskRepositoryPort taskRepositoryPort;

    @Mock private UserRepositoryPort userRepository;

    @Mock
    private com.diegovilla.task_manager.core.security.jwt.utils.PermissionValidator
            permissionValidator;

    @InjectMocks private TaskService taskService;

    private final UserModel user =
            UserModel.create("John", "Doe", "john.doe@example.com", "hash_1234");

    @Test
    @DisplayName("Should retrieve all tasks successfully")
    void shouldGetAllTasks() {
        TaskFiltersCommand taskFiltersCommand = new TaskFiltersCommand(null, null, null);
        TaskPaginationCommand paginationCommand = new TaskPaginationCommand(0, 10);
        List<TaskWithUser> taskList =
                List.of(
                        new TaskWithUser(
                                TaskModel.create("Task 1", "Description 1", user.getId()), user),
                        new TaskWithUser(
                                TaskModel.create("Task 2", "Description 2", user.getId()), user));
        Page<TaskWithUser> page = new PageImpl<>(taskList);

        when(taskRepositoryPort.getAll(any(PageRequest.class), any())).thenReturn(page);

        Page<TaskWithUser> tasksResponse =
                taskService.getAll(paginationCommand, taskFiltersCommand);

        assertThat(tasksResponse).isSameAs(page);
        verify(taskRepositoryPort).getAll(any(PageRequest.class), any());
    }

    @Test
    @DisplayName("Should retrieve a task by its ID successfully")
    void shouldGetUserById() {
        TaskModel task = TaskModel.create("Task 1", "Description 1", user.getId());
        TaskWithUser taskWithUser = new TaskWithUser(task, user);

        when(taskRepositoryPort.getByIdWithUser(task.getId()))
                .thenReturn(Optional.of(taskWithUser));

        TaskWithUser taskFound = taskService.getById(task.getId());

        assertThat(taskFound).isSameAs(taskWithUser);
        verify(taskRepositoryPort).getByIdWithUser(task.getId());
    }

    @Test
    @DisplayName("Should reject retrieval of a task by ID if it does not exist")
    void shouldRejectGetUserByIdNotFound() {
        UUID id = UUID.randomUUID();

        when(taskRepositoryPort.getByIdWithUser(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getById(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Task not found.");

        verify(taskRepositoryPort).getByIdWithUser(id);
    }

    @Test
    @DisplayName("Should create a task successfully when it does not already exist")
    void shouldCreateTaskSuccessfully() {
        UUID userId = UUID.randomUUID();
        TaskCreateCommand command =
                new TaskCreateCommand("Test Task", "This is a test task", userId);
        UserWithTaskCount userFound =
                new UserWithTaskCount(
                        UserModel.reconstruct(
                                userId,
                                "John",
                                "Doe",
                                "john.doe@example.com",
                                "hash_12345",
                                UserRole.USER,
                                Instant.now(),
                                Instant.now()),
                        10L);

        when(taskRepositoryPort.existsByTitleIgnoreCase(StringUtils.normalize(command.title())))
                .thenReturn(false);

        when(userRepository.getById(command.userId())).thenReturn(Optional.of(userFound));

        when(taskRepositoryPort.save(any(TaskModel.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TaskWithUser taskCreated = taskService.create(command);

        assertThat(taskCreated).isNotNull();
        assertThat(taskCreated.task().getTitle()).isEqualTo(command.title());
        assertThat(taskCreated.task().getDescription()).isEqualTo(command.description());

        verify(taskRepositoryPort).existsByTitleIgnoreCase(StringUtils.normalize(command.title()));
        verify(userRepository).getById(command.userId());
        verify(taskRepositoryPort).save(any(TaskModel.class));
    }

    @Test
    @DisplayName("Should reject task creation if a task with the same title already exists")
    void shouldRejectCreateTaskIfAlreadyExists() {
        TaskCreateCommand command =
                new TaskCreateCommand("Test Task", "This is a test task", UUID.randomUUID());

        when(taskRepositoryPort.existsByTitleIgnoreCase(StringUtils.normalize(command.title())))
                .thenReturn(true);

        assertThatThrownBy(() -> taskService.create(command))
                .isInstanceOf(TaskAlreadyExistsException.class)
                .hasMessage("A task with this title already exists.");

        verify(taskRepositoryPort).existsByTitleIgnoreCase(StringUtils.normalize(command.title()));
        verify(taskRepositoryPort, never()).save(any());
    }

    @Test
    @DisplayName("Should update a task successfully")
    void shouldUpdateTask() {
        UUID taskId = UUID.randomUUID();
        TaskUpdateCommand command = new TaskUpdateCommand("Test 1 Task", null);
        TaskModel taskFound =
                TaskModel.reconstruct(
                        taskId,
                        "Task 1",
                        "Task Desc 1",
                        TaskStatus.PENDING,
                        user.getId(),
                        Instant.now(),
                        Instant.now());
        TaskWithUser taskWithUser = new TaskWithUser(taskFound, user);

        when(taskRepositoryPort.getByIdWithUser(taskId)).thenReturn(Optional.of(taskWithUser));
        when(taskRepositoryPort.existsByTitleIgnoreCase(StringUtils.normalize(command.title())))
                .thenReturn(false);
        when(taskRepositoryPort.save(taskFound)).thenReturn(taskFound);

        TaskWithUser taskUpdated = taskService.update(taskId, command);

        assertThat(taskUpdated.task().getTitle()).isEqualTo(command.title());
        assertThat(taskUpdated.task().getDescription()).isEqualTo(taskFound.getDescription());

        verify(taskRepositoryPort).getByIdWithUser(taskId);
        verify(taskRepositoryPort).existsByTitleIgnoreCase(StringUtils.normalize(command.title()));
        verify(taskRepositoryPort).save(taskFound);
    }

    @Test
    @DisplayName("Should reject task update if a task with the new title already exists")
    void shouldRejectUpdateTaskIfTitleExists() {
        UUID taskId = UUID.randomUUID();
        TaskUpdateCommand command = new TaskUpdateCommand("Test 1 Task", null);
        TaskModel taskFound =
                TaskModel.reconstruct(
                        taskId,
                        "Task 1",
                        "Task Desc 1",
                        TaskStatus.PENDING,
                        user.getId(),
                        Instant.now(),
                        Instant.now());
        TaskWithUser taskWithUser = new TaskWithUser(taskFound, user);

        when(taskRepositoryPort.getByIdWithUser(taskId)).thenReturn(Optional.of(taskWithUser));
        when(taskRepositoryPort.existsByTitleIgnoreCase(StringUtils.normalize(command.title())))
                .thenReturn(true);

        assertThatThrownBy(() -> taskService.update(taskId, command))
                .isInstanceOf(TaskAlreadyExistsException.class)
                .hasMessage("A task with this title already exists.");

        verify(taskRepositoryPort).getByIdWithUser(taskId);
        verify(taskRepositoryPort).existsByTitleIgnoreCase(StringUtils.normalize(command.title()));
        verify(taskRepositoryPort, never()).save(any());
    }

    @Test
    @DisplayName("Should delete a task successfully")
    void shouldDeleteTaskSuccessfully() {
        UUID taskId = UUID.randomUUID();
        TaskModel taskFound =
                TaskModel.reconstruct(
                        taskId,
                        "Task 1",
                        "Task Desc 1",
                        TaskStatus.PENDING,
                        user.getId(),
                        Instant.now(),
                        Instant.now());
        TaskWithUser taskWithUser = new TaskWithUser(taskFound, user);

        when(taskRepositoryPort.getByIdWithUser(taskId)).thenReturn(Optional.of(taskWithUser));
        doNothing().when(taskRepositoryPort).delete(taskId);

        taskService.delete(taskId);

        verify(taskRepositoryPort).getByIdWithUser(taskId);
        verify(taskRepositoryPort).delete(taskId);
    }

    @Test
    @DisplayName("Should start a task successfully")
    void shouldStartTaskSuccessfully() {
        UUID taskId = UUID.randomUUID();
        TaskModel taskFound =
                TaskModel.reconstruct(
                        taskId,
                        "Task 1",
                        "Task Desc 1",
                        TaskStatus.PENDING,
                        user.getId(),
                        Instant.now(),
                        Instant.now());
        TaskWithUser taskWithUser = new TaskWithUser(taskFound, user);

        when(taskRepositoryPort.getByIdWithUser(taskId)).thenReturn(Optional.of(taskWithUser));
        when(taskRepositoryPort.save(taskFound)).thenReturn(taskFound);

        taskService.start(taskId);

        assertThat(taskFound.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);

        verify(taskRepositoryPort).getByIdWithUser(taskId);
        verify(taskRepositoryPort).save(taskFound);
    }

    @Test
    void shouldCompleteTaskSuccessfully() {
        UUID taskId = UUID.randomUUID();
        TaskModel taskFound =
                TaskModel.reconstruct(
                        taskId,
                        "Task 1",
                        "Task Desc 1",
                        TaskStatus.IN_PROGRESS,
                        user.getId(),
                        Instant.now(),
                        Instant.now());
        TaskWithUser taskWithUser = new TaskWithUser(taskFound, user);

        when(taskRepositoryPort.getByIdWithUser(taskId)).thenReturn(Optional.of(taskWithUser));
        when(taskRepositoryPort.save(taskFound)).thenReturn(taskFound);

        taskService.complete(taskId);

        assertThat(taskFound.getStatus()).isEqualTo(TaskStatus.COMPLETED);

        verify(taskRepositoryPort).getByIdWithUser(taskId);
        verify(taskRepositoryPort).save(taskFound);
    }
}
