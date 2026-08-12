package com.diegovilla.task_manager.features.task.infrastructure.mappers;

import com.diegovilla.task_manager.features.task.application.dto.response.TaskWithUser;
import com.diegovilla.task_manager.features.task.infrastructure.dto.response.TaskWithUserResponseDTO;
import org.mapstruct.Mapper;

import com.diegovilla.task_manager.features.task.application.commands.TaskCreateCommand;
import com.diegovilla.task_manager.features.task.application.commands.TaskUpdateCommand;
import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskCreateRequestDTO;
import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskUpdateRequestDTO;
import com.diegovilla.task_manager.features.user.infrastructure.mappers.UserDtoMapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserDtoMapper.class})
public interface TaskDtoMapper {

  /**
   * Converts a creation request DTO into an application command.
   *
   * @param taskCreateRequestDTO the incoming creation request.
   * @return a {@link TaskCreateCommand} carrying the creation data.
   */
  TaskCreateCommand createRequestDTOToCommand(TaskCreateRequestDTO taskCreateRequestDTO);

  /**
   * Converts an update request DTO into an application command.
   *
   * @param taskUpdateRequestDTO the incoming update request.
   * @return a {@link TaskUpdateCommand} carrying the update data.
   */
  TaskUpdateCommand updateRequestDTOToCommand(TaskUpdateRequestDTO taskUpdateRequestDTO);

  @Mapping(target = "id", source = "task.id")
  @Mapping(target = "title", source = "task.title")
  @Mapping(target = "description", source = "task.description")
  @Mapping(target = "status", source = "task.status")
  @Mapping(target = "user", source = "user")
  @Mapping(target = "createdAt", source = "task.createdAt")
  TaskWithUserResponseDTO modelToWithUserResponseDTO(TaskWithUser taskWithUser);
}
