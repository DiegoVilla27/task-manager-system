package com.diegovilla.task_manager.features.task.infrastructure.adapters;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.diegovilla.task_manager.core.errors.exceptions.DomainException;
import com.diegovilla.task_manager.core.errors.translators.DatabaseExceptionTranslator;
import com.diegovilla.task_manager.features.task.application.commands.TaskFiltersCommand;
import com.diegovilla.task_manager.features.task.application.dto.response.TaskWithUser;
import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;
import com.diegovilla.task_manager.features.task.infrastructure.entity.TaskEntity;
import com.diegovilla.task_manager.features.task.infrastructure.mappers.TaskEntityMapper;
import com.diegovilla.task_manager.features.task.infrastructure.repository.TaskJpaRepository;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.domain.valueobjects.UserRole;
import com.diegovilla.task_manager.features.user.infrastructure.entity.UserEntity;
import com.diegovilla.task_manager.features.user.infrastructure.mappers.UserEntityMapper;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@ExtendWith(MockitoExtension.class)
class TaskRepositoryAdapterTest {

    @Mock private TaskJpaRepository taskJpaRepository;
    @Mock private TaskEntityMapper taskEntityMapper;
    @Mock private UserEntityMapper userEntityMapper;
    @Mock private DatabaseExceptionTranslator databaseExceptionTranslator;

    @InjectMocks private TaskRepositoryAdapter taskRepositoryAdapter;

    private UUID taskId;
    private UUID userId;
    private TaskEntity taskEntity;
    private UserEntity userEntity;
    private TaskModel taskModel;
    private UserModel userModel;

    @BeforeEach
    void setUp() {
        taskId = UUID.randomUUID();
        userId = UUID.randomUUID();

        userEntity =
                UserEntity.builder()
                        .id(userId)
                        .name("Jane")
                        .lastname("Doe")
                        .email("jane@example.com")
                        .role(UserRole.USER)
                        .taskCount(0L)
                        .build();

        userModel =
                UserModel.reconstruct(
                        userId,
                        "Jane",
                        "Doe",
                        "jane@example.com",
                        "hashed_pass",
                        UserRole.USER,
                        Instant.now(),
                        Instant.now());

        taskEntity =
                TaskEntity.builder()
                        .id(taskId)
                        .title("Test Task")
                        .description("Task description")
                        .status(TaskStatus.PENDING)
                        .user(userEntity)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build();

        taskModel =
                TaskModel.reconstruct(
                        taskId,
                        "Test Task",
                        "Task description",
                        TaskStatus.PENDING,
                        userId,
                        Instant.now(),
                        Instant.now());
    }

    @Test
    @DisplayName("Should check if task exists by title ignore case")
    void shouldCheckExistsByTitleIgnoreCase() {
        when(taskJpaRepository.existsByTitleIgnoreCase("Test Task")).thenReturn(true);
        when(taskJpaRepository.existsByTitleIgnoreCase("Nonexistent")).thenReturn(false);

        assertThat(taskRepositoryAdapter.existsByTitleIgnoreCase("Test Task")).isTrue();
        assertThat(taskRepositoryAdapter.existsByTitleIgnoreCase("Nonexistent")).isFalse();
    }

    @Test
    @DisplayName("Should get all tasks paginated with filters")
    @SuppressWarnings("unchecked")
    void shouldGetAllTasksWithFilters() {
        Pageable pageable = PageRequest.of(0, 10);
        TaskFiltersCommand filters = new TaskFiltersCommand(null, "Test", TaskStatus.PENDING);
        Page<TaskEntity> page = new PageImpl<>(List.of(taskEntity));

        when(taskJpaRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(taskEntityMapper.entityToModel(taskEntity)).thenReturn(taskModel);
        when(userEntityMapper.entityToModel(userEntity)).thenReturn(userModel);

        Page<TaskWithUser> result = taskRepositoryAdapter.getAll(pageable, filters);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).task().getTitle()).isEqualTo("Test Task");
        assertThat(result.getContent().get(0).user().getName()).isEqualTo("Jane");
    }

    @Test
    @DisplayName("Should get task by id when exists")
    void shouldGetTaskById() {
        when(taskJpaRepository.findById(taskId)).thenReturn(Optional.of(taskEntity));
        when(taskEntityMapper.entityToModel(taskEntity)).thenReturn(taskModel);

        Optional<TaskModel> result = taskRepositoryAdapter.getById(taskId);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(taskId);
    }

    @Test
    @DisplayName("Should get task by id with user when exists")
    void shouldGetByIdWithUser() {
        when(taskJpaRepository.findByIdWithUser(taskId)).thenReturn(Optional.of(taskEntity));
        when(taskEntityMapper.entityToModel(taskEntity)).thenReturn(taskModel);
        when(userEntityMapper.entityToModel(userEntity)).thenReturn(userModel);

        Optional<TaskWithUser> result = taskRepositoryAdapter.getByIdWithUser(taskId);

        assertThat(result).isPresent();
        assertThat(result.get().task().getId()).isEqualTo(taskId);
        assertThat(result.get().user().getEmail()).isEqualTo("jane@example.com");
    }

    @Test
    @DisplayName("Should save task successfully")
    void shouldSaveTaskSuccessfully() {
        when(taskEntityMapper.modelToEntity(taskModel)).thenReturn(taskEntity);
        when(taskJpaRepository.saveAndFlush(taskEntity)).thenReturn(taskEntity);
        when(taskEntityMapper.entityToModel(taskEntity)).thenReturn(taskModel);

        TaskModel result = taskRepositoryAdapter.save(taskModel);

        assertThat(result).isEqualTo(taskModel);
    }

    @Test
    @DisplayName("Should translate exception on save when DataIntegrityViolationException occurs")
    void shouldTranslateExceptionOnSave() {
        when(taskEntityMapper.modelToEntity(taskModel)).thenReturn(taskEntity);
        when(taskJpaRepository.saveAndFlush(taskEntity))
                .thenThrow(new DataIntegrityViolationException("duplicate"));
        when(databaseExceptionTranslator.translate(any(DataIntegrityViolationException.class)))
                .thenReturn(new DomainException("Translated DB Error"));

        assertThatThrownBy(() -> taskRepositoryAdapter.save(taskModel))
                .isInstanceOf(DomainException.class)
                .hasMessage("Translated DB Error");
    }

    @Test
    @DisplayName("Should delete task by id successfully")
    void shouldDeleteTaskSuccessfully() {
        taskRepositoryAdapter.delete(taskId);

        verify(taskJpaRepository).deleteById(taskId);
        verify(taskJpaRepository).flush();
    }

    @Test
    @DisplayName("Should translate exception on delete when DataIntegrityViolationException occurs")
    void shouldTranslateExceptionOnDelete() {
        doThrow(new DataIntegrityViolationException("fk"))
                .when(taskJpaRepository)
                .deleteById(taskId);
        when(databaseExceptionTranslator.translate(any(DataIntegrityViolationException.class)))
                .thenReturn(new DomainException("Translated FK Error"));

        assertThatThrownBy(() -> taskRepositoryAdapter.delete(taskId))
                .isInstanceOf(DomainException.class)
                .hasMessage("Translated FK Error");
    }

    @Test
    @DisplayName("Should delete all tasks by user id successfully")
    void shouldDeleteAllByUserIdSuccessfully() {
        taskRepositoryAdapter.deleteAllByUserId(userId);

        verify(taskJpaRepository).deleteAllByUserId(userId);
        verify(taskJpaRepository).flush();
    }

    @Test
    @DisplayName(
            "Should translate exception on deleteAllByUserId when DataIntegrityViolationException occurs")
    void shouldTranslateExceptionOnDeleteAllByUserId() {
        doThrow(new DataIntegrityViolationException("error"))
                .when(taskJpaRepository)
                .deleteAllByUserId(userId);
        when(databaseExceptionTranslator.translate(any(DataIntegrityViolationException.class)))
                .thenReturn(new DomainException("Translated Error"));

        assertThatThrownBy(() -> taskRepositoryAdapter.deleteAllByUserId(userId))
                .isInstanceOf(DomainException.class)
                .hasMessage("Translated Error");
    }
}
