package com.diegovilla.task_manager.features.task.infrastructure.mappers;

import org.mapstruct.Mapper;

import com.diegovilla.task_manager.features.task.application.commands.TaskCreateCommand;
import com.diegovilla.task_manager.features.task.application.commands.TaskUpdateCommand;
import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskCreateRequestDTO;
import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskUpdateRequestDTO;
import com.diegovilla.task_manager.features.task.infrastructure.dto.response.TaskResponseDTO;
import com.diegovilla.task_manager.features.user.infrastructure.mappers.UserDtoMapper;

@Mapper(componentModel = "spring", uses = { UserDtoMapper.class })
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

  /**
   * Converts a domain model into a response DTO for the client.
   *
   * @param taskModel the domain model to convert.
   * @return the corresponding {@link TaskResponseDTO}.
   */
  TaskResponseDTO modelToResponseDTO(TaskModel taskModel);
}
