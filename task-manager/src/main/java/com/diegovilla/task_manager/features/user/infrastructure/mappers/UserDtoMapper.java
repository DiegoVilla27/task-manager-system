package com.diegovilla.task_manager.features.user.infrastructure.mappers;

import com.diegovilla.task_manager.features.user.application.commands.UserCreateCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserUpdateCommand;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserCreateRequestDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserUpdateRequestDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.response.UserResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserDtoMapper {

  UserCreateCommand createRequestDTOToCommand(UserCreateRequestDTO userCreateRequestDTO);

  UserUpdateCommand updateRequestDTOToCommand(UserUpdateRequestDTO userUpdateRequestDTO);

  UserResponseDTO modelToResponseDTO(UserModel userModel);
}
