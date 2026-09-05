package com.diegovilla.task_manager.features.task.infrastructure.adapters;

import com.diegovilla.task_manager.core.errors.translators.DatabaseExceptionTranslator;
import com.diegovilla.task_manager.features.task.application.commands.TaskFiltersCommand;
import com.diegovilla.task_manager.features.task.application.dto.response.TaskWithUser;
import com.diegovilla.task_manager.features.task.application.ports.TaskRepositoryPort;
import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import com.diegovilla.task_manager.features.task.infrastructure.entity.TaskEntity;
import com.diegovilla.task_manager.features.task.infrastructure.mappers.TaskEntityMapper;
import com.diegovilla.task_manager.features.task.infrastructure.repository.TaskJpaRepository;
import com.diegovilla.task_manager.features.task.infrastructure.specifications.TaskSpecifications;
import com.diegovilla.task_manager.features.user.infrastructure.mappers.UserEntityMapper;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

/**
 * Persistence infrastructure adapter implementing {@link TaskRepositoryPort}.
 *
 * <p>Adapts domain persistence operations to Spring Data JPA, executing query specifications,
 * entity-to-model mapping, and database exception translations.
 *
 * @since 1.0.0
 */
@Component
@AllArgsConstructor
public class TaskRepositoryAdapter implements TaskRepositoryPort {

    private final TaskJpaRepository taskJpaRepository;
    private final TaskEntityMapper taskEntityMapper;
    private final UserEntityMapper userEntityMapper;
    private final DatabaseExceptionTranslator databaseExceptionTranslator;

    /** {@inheritDoc} */
    @Override
    public boolean existsByTitleIgnoreCase(String title) {
        return taskJpaRepository.existsByTitleIgnoreCase(title);
    }

    /** {@inheritDoc} */
    @Override
    public Page<TaskWithUser> getAll(Pageable pageable, TaskFiltersCommand filters) {
        Specification<TaskEntity> spec = TaskSpecifications.withFilters(filters);

        return taskJpaRepository
                .findAll(spec, pageable)
                .map(
                        (taskEntity) ->
                                new TaskWithUser(
                                        taskEntityMapper.entityToModel(taskEntity),
                                        userEntityMapper.entityToModel(taskEntity.getUser())));
    }

    /** {@inheritDoc} */
    @Override
    public Optional<TaskModel> getById(UUID id) {
        return taskJpaRepository.findById(id).map(taskEntityMapper::entityToModel);
    }

    /** {@inheritDoc} */
    @Override
    public Optional<TaskWithUser> getByIdWithUser(UUID id) {
        return taskJpaRepository
                .findByIdWithUser(id)
                .map(
                        (taskEntity) ->
                                new TaskWithUser(
                                        taskEntityMapper.entityToModel(taskEntity),
                                        userEntityMapper.entityToModel(taskEntity.getUser())));
    }

    /** {@inheritDoc} */
    @Override
    public TaskModel save(TaskModel task) {
        try {
            TaskEntity taskNew = taskEntityMapper.modelToEntity(task);
            TaskEntity taskSaved = taskJpaRepository.saveAndFlush(taskNew);

            return taskEntityMapper.entityToModel(taskSaved);
        } catch (DataIntegrityViolationException ex) {
            throw databaseExceptionTranslator.translate(ex);
        }
    }

    /** {@inheritDoc} */
    @Override
    public void delete(UUID id) {
        try {
            taskJpaRepository.deleteById(id);
            taskJpaRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw databaseExceptionTranslator.translate(ex);
        }
    }

    /** {@inheritDoc} */
    @Override
    public void deleteAllByUserId(UUID userId) {
        try {
            taskJpaRepository.deleteAllByUserId(userId);
            taskJpaRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw databaseExceptionTranslator.translate(ex);
        }
    }
}
