package com.diegovilla.task_manager.features.task.infrastructure.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import com.diegovilla.task_manager.features.task.infrastructure.entity.TaskEntity;

/**
 * MapStruct mapper converting between {@link TaskEntity} persistence entities and {@link TaskModel} domain models.
 *
 * @since 1.0.0
 */
@Mapper(componentModel = "spring")
public interface TaskEntityMapper {
  /**
   * Converts a JPA entity into a domain model.
   *
   * @param taskEntity the JPA entity to convert.
   * @return the corresponding domain model.
   */
  default TaskModel entityToModel(TaskEntity taskEntity) {
    if (taskEntity == null) {
      return null;
    }
    return TaskModel.reconstruct(
        taskEntity.getId(),
        taskEntity.getTitle(),
        taskEntity.getDescription(),
        taskEntity.getStatus(),
        taskEntity.getUser().getId(),
        taskEntity.getCreatedAt(),
        taskEntity.getUpdatedAt());
  }

  /**
   * Converts a domain model into a JPA entity for persistence.
   *
   * @param taskModel the domain model to convert.
   * @return the corresponding JPA entity ready for persistence.
   */
  @Mapping(target = "user.id", source = "userId")
  TaskEntity modelToEntity(TaskModel taskModel);
}
