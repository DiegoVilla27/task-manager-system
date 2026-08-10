package com.diegovilla.task_manager.task.infrastructure.mappers;

import com.diegovilla.task_manager.task.application.commands.TaskCreateCommand;
import com.diegovilla.task_manager.task.application.commands.TaskUpdateCommand;
import com.diegovilla.task_manager.task.domain.models.TaskModel;
import com.diegovilla.task_manager.task.infrastructure.dtos.request.TaskCreateRequestDTO;
import com.diegovilla.task_manager.task.infrastructure.dtos.request.TaskUpdateRequestDTO;
import com.diegovilla.task_manager.task.infrastructure.dtos.response.TaskResponseDTO;
import com.diegovilla.task_manager.user.infrastructure.mappers.UserDtoMapper;

import org.mapstruct.Mapper;

/**
 * MapStruct mapper responsible for converting between task DTOs,
 * domain models and application commands.
 *
 * <p>
 * Handles the mapping logic required by the infrastructure layer
 * to translate incoming HTTP requests into domain objects and
 * domain objects into API responses.
 * </p>
 *
 * @since 1.0.0
 */
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
