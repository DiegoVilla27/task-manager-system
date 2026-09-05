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

/**
 * MapStruct mapper converting between authentication DTOs, domain models, and application commands.
 *
 * @since 1.0.0
 */
@Mapper(componentModel = "spring")
public interface AuthDtoMapper {

    /**
     * Converts a login request DTO into an application login command.
     *
     * @param authLoginRequestDTO incoming login credentials DTO.
     * @return an {@link AuthLoginCommand} carrying the credentials.
     */
    AuthLoginCommand loginRequestDTOToCommand(AuthLoginRequestDTO authLoginRequestDTO);

    /**
     * Converts a registration request DTO into an application registration command.
     *
     * @param authRegisterRequestDTO incoming registration DTO.
     * @return an {@link AuthRegisterCommand} carrying the registration data.
     */
    AuthRegisterCommand registerRequestDTOToCommand(AuthRegisterRequestDTO authRegisterRequestDTO);

    /**
     * Converts a refresh token request DTO into an application refresh command.
     *
     * @param authRefreshRequestDTO incoming refresh token DTO.
     * @return an {@link AuthRefreshCommand} carrying the refresh token.
     */
    AuthRefreshCommand refreshRequestDTOToCommand(AuthRefreshRequestDTO authRefreshRequestDTO);

    /**
     * Converts a domain {@link JwtModel} into an HTTP response DTO.
     *
     * @param res the issued token model.
     * @return an {@link AuthResponseDTO} formatted for JSON client serialization.
     */
    AuthResponseDTO jwtModelToResponseDTO(JwtModel res);
}
