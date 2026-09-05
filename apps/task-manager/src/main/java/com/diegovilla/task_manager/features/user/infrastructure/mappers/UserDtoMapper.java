package com.diegovilla.task_manager.features.user.infrastructure.mappers;

import com.diegovilla.task_manager.features.task.infrastructure.mappers.TaskDtoMapper;
import com.diegovilla.task_manager.features.user.application.commands.UserCreateCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserFiltersCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserUpdateCommand;
import com.diegovilla.task_manager.features.user.application.dto.response.UserWithTaskCount;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserCreateRequestDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserFiltersDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserUpdateRequestDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.response.UserWithTaskCountResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper converting between user HTTP DTOs, application commands, and response
 * projections.
 *
 * @since 1.0.0
 */
@Mapper(
        componentModel = "spring",
        uses = {TaskDtoMapper.class})
public interface UserDtoMapper {

    /**
     * Converts a user creation request DTO into an application command.
     *
     * @param userCreateRequestDTO the incoming creation request payload.
     * @return a {@link UserCreateCommand} carrying creation parameters.
     */
    UserCreateCommand createRequestDTOToCommand(UserCreateRequestDTO userCreateRequestDTO);

    /**
     * Converts a user update request DTO into an application command.
     *
     * @param userUpdateRequestDTO the incoming update request payload.
     * @return a {@link UserUpdateCommand} carrying mutable profile fields.
     */
    UserUpdateCommand updateRequestDTOToCommand(UserUpdateRequestDTO userUpdateRequestDTO);

    /**
     * Converts a user query filters DTO into an application filtering command.
     *
     * @param userFiltersDTO incoming query filters.
     * @return a {@link UserFiltersCommand} carrying filter parameters.
     */
    UserFiltersCommand filtersRequestDTOToCommand(UserFiltersDTO userFiltersDTO);

    /**
     * Converts a composite {@link UserWithTaskCount} read projection into an HTTP response DTO.
     *
     * @param userWithTaskCount composite user model and task count projection.
     * @return a {@link UserWithTaskCountResponseDTO} formatted for JSON serialization.
     */
    @Mapping(target = "id", source = "user.id")
    @Mapping(target = "name", source = "user.name")
    @Mapping(target = "lastname", source = "user.lastname")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "countTasks", source = "countTasks")
    @Mapping(target = "createdAt", source = "user.createdAt")
    UserWithTaskCountResponseDTO modelToWithTasksResponseDTO(UserWithTaskCount userWithTaskCount);
}
