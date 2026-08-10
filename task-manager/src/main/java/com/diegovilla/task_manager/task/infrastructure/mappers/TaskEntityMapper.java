package com.diegovilla.task_manager.task.infrastructure.mappers;

import com.diegovilla.task_manager.task.domain.models.TaskModel;
import com.diegovilla.task_manager.task.infrastructure.entities.TaskEntity;
import com.diegovilla.task_manager.user.infrastructure.mappers.UserEntityMapper;

import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * MapStruct mapper responsible for converting between
 * {@link TaskEntity} and {@link TaskModel}.
 *
 * @since 1.0.0
 */
@Mapper(componentModel = "spring", uses = { UserEntityMapper.class })
public abstract class TaskEntityMapper {

  @Autowired
  protected UserEntityMapper userEntityMapper;

  /**
   * Converts a JPA entity into a domain model.
   *
   * @param taskEntity the JPA entity to convert.
   * @return the corresponding domain model.
   */
  public TaskModel entityToModel(TaskEntity taskEntity) {
    if (taskEntity == null) {
      return null;
    }
    return TaskModel.reconstruct(
        taskEntity.getId(),
        taskEntity.getTitle(),
        taskEntity.getDescription(),
        taskEntity.getStatus(),
        userEntityMapper.entityToModel(taskEntity.getUser()),
        taskEntity.getCreatedAt(),
        taskEntity.getUpdatedAt());
  }

  /**
   * Converts a domain model into a JPA entity for persistence.
   *
   * @param taskModel the domain model to convert.
   * @return the corresponding JPA entity ready for persistence.
   */
  public abstract TaskEntity modelToEntity(TaskModel taskModel);
}
