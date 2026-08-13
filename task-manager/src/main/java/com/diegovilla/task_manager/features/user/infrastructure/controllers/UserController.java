package com.diegovilla.task_manager.features.user.infrastructure.controllers;

import com.diegovilla.task_manager.features.user.application.commands.UserCreateCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserFiltersCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserPaginationCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserUpdateCommand;
import com.diegovilla.task_manager.features.user.application.dto.response.UserWithTaskCount;
import com.diegovilla.task_manager.features.user.application.services.UserService;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserFiltersDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.response.UserWithTaskCountResponseDTO;
import com.diegovilla.task_manager.features.user.infrastructure.mappers.UserDtoMapper;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserCreateRequestDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserUpdateRequestDTO;
import com.diegovilla.task_manager.features.user.infrastructure.docs.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Validated
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Exposes operations for managing user accounts within the Task Manager platform.")
public class UserController {

  private final UserService userService;
  private final UserDtoMapper userDtoMapper;

  @GetMapping
  @GetUsersDocumentation
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Page<UserWithTaskCountResponseDTO>> getAll(
    @RequestParam(defaultValue = "1")
    @Min(value = 1, message = "Page must be greater than or equal to 0")
    int page,
    @RequestParam(defaultValue = "10")
    @Min(value = 1, message = "Limit must be greater than 0")
    int limit,
    UserFiltersDTO filters
  ) {
    UserPaginationCommand userPaginationCommand = new UserPaginationCommand(page - 1, limit);
    UserFiltersCommand userFiltersCommand = userDtoMapper.filtersRequestDTOToCommand(filters);
    Page<UserWithTaskCount> users = userService.getAll(userPaginationCommand, userFiltersCommand);

    return ResponseEntity.ok(users.map(userDtoMapper::modelToWithTasksResponseDTO));
  }

  @GetMapping("/{id}")
  @GetUserDocumentation
  public ResponseEntity<UserWithTaskCountResponseDTO> getById(@PathVariable UUID id) {
    UserWithTaskCount user = userService.getById(id);

    return ResponseEntity.ok(userDtoMapper.modelToWithTasksResponseDTO(user));
  }

  @PostMapping
  @CreateUserDocumentation
  public ResponseEntity<UserWithTaskCountResponseDTO> create(
    @Valid @RequestBody UserCreateRequestDTO dto) {
    UserCreateCommand userCreateCommand = userDtoMapper.createRequestDTOToCommand(dto);
    UserWithTaskCount userCreated = userService.create(userCreateCommand);

    return ResponseEntity.status(HttpStatus.CREATED)
      .body(userDtoMapper.modelToWithTasksResponseDTO(userCreated));
  }

  @PatchMapping("/{id}")
  @UpdateUserDocumentation
  public ResponseEntity<UserWithTaskCountResponseDTO> update(
    @PathVariable UUID id,
    @Valid @RequestBody UserUpdateRequestDTO dto) {
    UserUpdateCommand userUpdateCommand = userDtoMapper.updateRequestDTOToCommand(dto);
    UserWithTaskCount userUpdated = userService.update(id, userUpdateCommand);

    return ResponseEntity.ok()
      .body(userDtoMapper.modelToWithTasksResponseDTO(userUpdated));
  }

  @DeleteMapping("/{id}")
  @DeleteUserDocumentation
  public ResponseEntity<Void> delete(
    @PathVariable UUID id,
    @RequestParam(defaultValue = "false") boolean force
  ) {
    userService.delete(id, force);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }
}
