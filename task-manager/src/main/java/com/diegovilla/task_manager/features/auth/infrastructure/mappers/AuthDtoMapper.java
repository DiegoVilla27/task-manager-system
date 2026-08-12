package com.diegovilla.task_manager.features.auth.infrastructure.mappers;

import com.diegovilla.task_manager.core.security.jwt.JwtModel;
import com.diegovilla.task_manager.features.auth.application.commands.AuthLoginCommand;
import com.diegovilla.task_manager.features.auth.application.commands.AuthRefreshCommand;
import com.diegovilla.task_manager.features.auth.application.commands.AuthRegisterCommand;
import com.diegovilla.task_manager.features.auth.infrastructure.dto.request.AuthLoginRequestDTO;
import com.diegovilla.task_manager.features.auth.infrastructure.dto.request.AuthRefreshRequestDTO;
import com.diegovilla.task_manager.features.auth.infrastructure.dto.request.AuthRegisterRequestDTO;
import com.diegovilla.task_manager.features.auth.infrastructure.dto.response.AuthResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuthDtoMapper {

  AuthLoginCommand loginRequestDTOToCommand(AuthLoginRequestDTO authLoginRequestDTO);

  AuthRegisterCommand registerRequestDTOToCommand(AuthRegisterRequestDTO authRegisterRequestDTO);

  AuthRefreshCommand refreshRequestDTOToCommand(AuthRefreshRequestDTO authRefreshRequestDTO);

  AuthResponseDTO jwtModelToResponseDTO(JwtModel res);
}
