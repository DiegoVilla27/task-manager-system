package com.diegovilla.task_manager.user.infrastructure.controllers;

import com.diegovilla.task_manager.user.application.commands.UserCreateCommand;
import com.diegovilla.task_manager.user.application.commands.UserUpdateCommand;
import com.diegovilla.task_manager.user.infrastructure.dtos.request.UserCreateRequestDTO;
import com.diegovilla.task_manager.user.infrastructure.dtos.request.UserUpdateRequestDTO;
import com.diegovilla.task_manager.user.infrastructure.dtos.response.UserResponseDTO;
import com.diegovilla.task_manager.user.infrastructure.docs.*;
import com.diegovilla.task_manager.user.domain.models.UserModel;
import com.diegovilla.task_manager.user.application.services.UserService;
import com.diegovilla.task_manager.user.infrastructure.mappers.UserDtoMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Validated
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(
  name = "Users",
  description = "Exposes operations for managing user accounts within the Task Manager platform."
)
public class UserController {

  private final UserService userService;
  private final UserDtoMapper userDtoMapper;

  @GetMapping
  @GetUsersDocumentation
  public ResponseEntity<List<UserResponseDTO>> getAll() {
    List<UserModel> users = userService.getAll();

    return ResponseEntity.ok(users
      .stream()
      .map(userDtoMapper::modelToResponseDTO)
      .toList()
    );
  }

  @GetMapping("/{id}")
  @GetUserDocumentation
  public ResponseEntity<UserResponseDTO> getById(@PathVariable UUID id) {
    UserModel user = userService.getById(id);

    return ResponseEntity.ok(userDtoMapper.modelToResponseDTO(user));
  }

  @PostMapping
  @CreateUserDocumentation
  public ResponseEntity<UserResponseDTO> create(
    @Valid @RequestBody UserCreateRequestDTO dto
  ) {
    UserCreateCommand userCreateCommand = userDtoMapper.createRequestDTOToCommand(dto);
    UserModel userCreated = userService.create(userCreateCommand);

    return ResponseEntity.status(HttpStatus.CREATED)
      .body(userDtoMapper.modelToResponseDTO(userCreated));
  }

  @PatchMapping("/{id}")
  @UpdateUserDocumentation
  public ResponseEntity<UserResponseDTO> update(
    @PathVariable UUID id,
    @Valid @RequestBody UserUpdateRequestDTO dto
  ) {
    UserUpdateCommand userUpdateCommand = userDtoMapper.updateRequestDTOToCommand(dto);
    UserModel userUpdated = userService.update(id, userUpdateCommand);

    return ResponseEntity.ok()
      .body(userDtoMapper.modelToResponseDTO(userUpdated));
  }

  @DeleteMapping("/{id}")
  @DeleteUserDocumentation
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    userService.delete(id);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }
}
