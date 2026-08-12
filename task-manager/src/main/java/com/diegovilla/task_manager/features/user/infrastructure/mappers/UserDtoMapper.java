package com.diegovilla.task_manager.features.user.infrastructure.mappers;

import com.diegovilla.task_manager.features.task.infrastructure.mappers.TaskDtoMapper;
import com.diegovilla.task_manager.features.user.application.commands.UserCreateCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserUpdateCommand;
import com.diegovilla.task_manager.features.user.application.dto.response.UserWithTaskCount;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserCreateRequestDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserUpdateRequestDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.response.UserResponseDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.response.UserWithTaskCountResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {TaskDtoMapper.class})
public interface UserDtoMapper {

  UserCreateCommand createRequestDTOToCommand(UserCreateRequestDTO userCreateRequestDTO);

  UserUpdateCommand updateRequestDTOToCommand(UserUpdateRequestDTO userUpdateRequestDTO);

  UserResponseDTO modelToResponseDTO(UserModel userModel);

  @Mapping(target = "id", source = "user.id")
  @Mapping(target = "name", source = "user.name")
  @Mapping(target = "lastname", source = "user.lastname")
  @Mapping(target = "email", source = "user.email")
  @Mapping(target = "countTasks", source = "countTasks")
  @Mapping(target = "createdAt", source = "user.createdAt")
  UserWithTaskCountResponseDTO modelToWithTasksResponseDTO(UserWithTaskCount userWithTaskCount);
}
