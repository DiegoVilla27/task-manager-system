package com.diegovilla.task_manager.task.infrastructure.repository;

import com.diegovilla.task_manager.core.errors.translators.DatabaseExceptionTranslator;
import com.diegovilla.task_manager.task.application.repository.TaskRepository;
import com.diegovilla.task_manager.task.domain.models.TaskModel;
import com.diegovilla.task_manager.task.infrastructure.entities.TaskEntity;
import com.diegovilla.task_manager.task.infrastructure.mappers.TaskEntityMapper;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Infrastructure adapter implementing the {@link TaskRepository} port.
 *
 * <p>Bridges the domain layer with JPA persistence by delegating
 * operations to {@link TaskJpaRepository} and converting between
 * {@link TaskEntity} and {@link TaskModel} via {@link TaskEntityMapper}.</p>
 *
 * <p>Database integrity violations are translated into domain-specific
 * exceptions through {@link DatabaseExceptionTranslator}.</p>
 *
 * @since 1.0.0
 */
@Component
@AllArgsConstructor
public class TaskRepositoryAdapter implements TaskRepository {

  private final TaskJpaRepository taskJpaRepository;
  private final TaskEntityMapper taskEntityMapper;
  private final DatabaseExceptionTranslator databaseExceptionTranslator;

  /** {@inheritDoc} */
  @Override
  public boolean existsByTitleIgnoreCase(String title) {
    return taskJpaRepository.existsByTitleIgnoreCase(title);
  }

  /** {@inheritDoc} */
  @Override
  public List<TaskModel> getAll() {
    return taskJpaRepository.getAllWithUser().stream().map(taskEntityMapper::entityToModel).toList();
  }

  /** {@inheritDoc} */
  @Override
  public Optional<TaskModel> getById(UUID id) {
    return taskJpaRepository.getByIdWithUser(id).map(taskEntityMapper::entityToModel);
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
    } catch (DataIntegrityViolationException ex) {
      throw databaseExceptionTranslator.translate(ex);
    }
  }
}
