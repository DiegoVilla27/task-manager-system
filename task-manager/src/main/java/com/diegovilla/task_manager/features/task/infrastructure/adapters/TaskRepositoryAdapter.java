package com.diegovilla.task_manager.features.task.infrastructure.adapters;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import com.diegovilla.task_manager.core.errors.translators.DatabaseExceptionTranslator;
import com.diegovilla.task_manager.features.task.application.ports.TaskRepository;
import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import com.diegovilla.task_manager.features.task.infrastructure.entity.TaskEntity;
import com.diegovilla.task_manager.features.task.infrastructure.mappers.TaskEntityMapper;
import com.diegovilla.task_manager.features.task.infrastructure.repository.TaskJpaRepository;

import lombok.AllArgsConstructor;

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
