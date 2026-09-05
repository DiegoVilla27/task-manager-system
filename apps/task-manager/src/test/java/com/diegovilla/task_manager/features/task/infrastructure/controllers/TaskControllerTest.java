package com.diegovilla.task_manager.features.task.infrastructure.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.diegovilla.task_manager.features.task.application.commands.TaskCreateCommand;
import com.diegovilla.task_manager.features.task.application.commands.TaskFiltersCommand;
import com.diegovilla.task_manager.features.task.application.commands.TaskPaginationCommand;
import com.diegovilla.task_manager.features.task.application.commands.TaskUpdateCommand;
import com.diegovilla.task_manager.features.task.application.dto.response.TaskWithUser;
import com.diegovilla.task_manager.features.task.application.services.TaskService;
import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;
import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskCreateRequestDTO;
import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskFiltersDTO;
import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskUpdateRequestDTO;
import com.diegovilla.task_manager.features.task.infrastructure.dto.response.TaskUserResponseDTO;
import com.diegovilla.task_manager.features.task.infrastructure.dto.response.TaskWithUserResponseDTO;
import com.diegovilla.task_manager.features.task.infrastructure.mappers.TaskDtoMapper;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.domain.valueobjects.UserRole;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    @Mock private TaskService taskService;
    @Mock private TaskDtoMapper taskDtoMapper;

    @InjectMocks private TaskController taskController;

    private UUID taskId;
    private UUID userId;
    private TaskWithUser taskWithUser;
    private TaskWithUserResponseDTO taskWithUserResponseDTO;

    @BeforeEach
    void setUp() {
        taskId = UUID.randomUUID();
        userId = UUID.randomUUID();

        TaskModel taskModel =
                TaskModel.reconstruct(
                        taskId,
                        "Report Task",
                        "Write report",
                        TaskStatus.PENDING,
                        userId,
                        Instant.now(),
                        Instant.now());

        UserModel userModel =
                UserModel.reconstruct(
                        userId,
                        "Bob",
                        "Builder",
                        "bob@example.com",
                        "password",
                        UserRole.USER,
                        Instant.now(),
                        Instant.now());

        taskWithUser = new TaskWithUser(taskModel, userModel);

        TaskUserResponseDTO userTaskDTO =
                new TaskUserResponseDTO(userId, "Bob", "Builder", "bob@example.com");

        taskWithUserResponseDTO =
                new TaskWithUserResponseDTO(
                        taskId,
                        "Report Task",
                        "Write report",
                        TaskStatus.PENDING,
                        userTaskDTO,
                        Instant.now());
    }

    @Test
    @DisplayName("Should get all tasks paginated and filtered")
    void shouldGetAllTasks() {
        TaskFiltersDTO filtersDTO = new TaskFiltersDTO(userId, "Report", TaskStatus.PENDING);
        TaskFiltersCommand filtersCommand =
                new TaskFiltersCommand(userId, "Report", TaskStatus.PENDING);
        Page<TaskWithUser> page = new PageImpl<>(List.of(taskWithUser));

        when(taskDtoMapper.taskFilterDTOToCommand(filtersDTO)).thenReturn(filtersCommand);
        when(taskService.getAll(any(TaskPaginationCommand.class), eq(filtersCommand)))
                .thenReturn(page);
        when(taskDtoMapper.modelToWithUserResponseDTO(taskWithUser))
                .thenReturn(taskWithUserResponseDTO);

        ResponseEntity<Page<TaskWithUserResponseDTO>> response =
                taskController.getAll(1, 10, filtersDTO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getContent()).hasSize(1);
    }

    @Test
    @DisplayName("Should get task by id")
    void shouldGetTaskById() {
        when(taskService.getById(taskId)).thenReturn(taskWithUser);
        when(taskDtoMapper.modelToWithUserResponseDTO(taskWithUser))
                .thenReturn(taskWithUserResponseDTO);

        ResponseEntity<TaskWithUserResponseDTO> response = taskController.getById(taskId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().id()).isEqualTo(taskId);
    }

    @Test
    @DisplayName("Should create task")
    void shouldCreateTask() {
        TaskCreateRequestDTO requestDTO =
                new TaskCreateRequestDTO(userId, "Report Task", "Write report");
        TaskCreateCommand command = new TaskCreateCommand("Report Task", "Write report", userId);

        when(taskDtoMapper.createRequestDTOToCommand(requestDTO)).thenReturn(command);
        when(taskService.create(command)).thenReturn(taskWithUser);
        when(taskDtoMapper.modelToWithUserResponseDTO(taskWithUser))
                .thenReturn(taskWithUserResponseDTO);

        ResponseEntity<TaskWithUserResponseDTO> response = taskController.create(requestDTO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().id()).isEqualTo(taskId);
    }

    @Test
    @DisplayName("Should update task")
    void shouldUpdateTask() {
        TaskUpdateRequestDTO requestDTO =
                new TaskUpdateRequestDTO("Updated title", "Updated description");
        TaskUpdateCommand command = new TaskUpdateCommand("Updated title", "Updated description");

        when(taskDtoMapper.updateRequestDTOToCommand(requestDTO)).thenReturn(command);
        when(taskService.update(taskId, command)).thenReturn(taskWithUser);
        when(taskDtoMapper.modelToWithUserResponseDTO(taskWithUser))
                .thenReturn(taskWithUserResponseDTO);

        ResponseEntity<TaskWithUserResponseDTO> response =
                taskController.update(taskId, requestDTO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
    }

    @Test
    @DisplayName("Should delete task")
    void shouldDeleteTask() {
        ResponseEntity<Void> response = taskController.delete(taskId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(taskService).delete(taskId);
    }

    @Test
    @DisplayName("Should start task")
    void shouldStartTask() {
        ResponseEntity<Void> response = taskController.start(taskId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(taskService).start(taskId);
    }

    @Test
    @DisplayName("Should complete task")
    void shouldCompleteTask() {
        ResponseEntity<Void> response = taskController.complete(taskId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(taskService).complete(taskId);
    }
}
