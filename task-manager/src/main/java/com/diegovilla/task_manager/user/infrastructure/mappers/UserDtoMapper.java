package com.diegovilla.task_manager.user.infrastructure.mappers;

import com.diegovilla.task_manager.user.application.commands.UserCreateCommand;
import com.diegovilla.task_manager.user.application.commands.UserUpdateCommand;
import com.diegovilla.task_manager.user.domain.models.UserModel;
import com.diegovilla.task_manager.user.infrastructure.dtos.request.UserCreateRequestDTO;
import com.diegovilla.task_manager.user.infrastructure.dtos.request.UserUpdateRequestDTO;
import com.diegovilla.task_manager.user.infrastructure.dtos.response.UserResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserDtoMapper {

  UserCreateCommand createRequestDTOToCommand(UserCreateRequestDTO userCreateRequestDTO);

  UserUpdateCommand updateRequestDTOToCommand(UserUpdateRequestDTO userUpdateRequestDTO);

  UserResponseDTO modelToResponseDTO(UserModel userModel);
}
