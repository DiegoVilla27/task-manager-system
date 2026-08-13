package com.diegovilla.task_manager.features.user.application.services;

import com.diegovilla.task_manager.core.errors.exceptions.ResourceNotFoundException;
import com.diegovilla.task_manager.core.security.jwt.utils.PermissionValidator;
import com.diegovilla.task_manager.features.task.application.ports.TaskRepositoryPort;
import com.diegovilla.task_manager.features.user.application.commands.UserCreateCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserFiltersCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserPaginationCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserUpdateCommand;
import com.diegovilla.task_manager.features.user.application.dto.response.UserWithTaskCount;
import com.diegovilla.task_manager.features.user.application.ports.PasswordHasherPort;
import com.diegovilla.task_manager.features.user.application.ports.UserRepositoryPort;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.domain.exceptions.UserAlreadyExistsException;
import com.diegovilla.task_manager.utils.data.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

  private final UserRepositoryPort userRepositoryPort;
  private final PasswordHasherPort passwordHasherPort;
  private final PermissionValidator permissionValidator;
  private final TaskRepositoryPort taskRepositoryPort;

  public Page<UserWithTaskCount> getAll(
    UserPaginationCommand userPaginationCommand,
    UserFiltersCommand filters
  ) {
    Pageable pageable = PageRequest.of(userPaginationCommand.page(), userPaginationCommand.limit());

    // Obtener usuario autenticado y su rol usando tu puerto
    UUID targetUserId = permissionValidator.getTargetUserId(filters.userId());
    // Crear el objeto de filtros efectivo que viajará al repositorio
    UserFiltersCommand effectiveFilters = new UserFiltersCommand(
      filters.search(),
      targetUserId
    );

    Page<UserWithTaskCount> users = userRepositoryPort.getAll(pageable, effectiveFilters);
    log.info("Users retrieved successfully. size={}", users.getContent().size());

    return users;
  }

  public UserWithTaskCount getById(UUID id) {
    UserWithTaskCount userFound = userRepositoryPort.getById(id)
      .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    permissionValidator.validateHasPermissions(userFound.user().getId());

    log.info("User retrieved successfully. id={}", userFound.user().getId());

    return userFound;
  }

  @Transactional
  public UserWithTaskCount create(UserCreateCommand userCreateCommand) {
    if (userRepositoryPort
      .existsByEmailIgnoreCase(StringUtils.normalize(userCreateCommand.email()))) {
      throw new UserAlreadyExistsException();
    }

    String passwordHash = passwordHasherPort.hash(userCreateCommand.password());

    UserModel user = UserModel.create(
      userCreateCommand.name(),
      userCreateCommand.lastname(),
      userCreateCommand.email(),
      passwordHash);

    UserModel userCreated = userRepositoryPort.save(user);
    log.info("User created successfully. id={}", userCreated.getId());

    return new UserWithTaskCount(userCreated, 0L);
  }

  @Transactional
  public UserWithTaskCount update(UUID id, UserUpdateCommand userUpdateCommand) {
    UserWithTaskCount userFound = getById(id);

    String emailNormalized = StringUtils.normalize(userUpdateCommand.email());
    if (!userFound.user().getEmail().equals(emailNormalized)
      && userRepositoryPort.existsByEmailIgnoreCase(emailNormalized)) {
      throw new UserAlreadyExistsException();
    }

    userFound.user().updateInformation(
      userUpdateCommand.name(),
      userUpdateCommand.lastname(),
      userUpdateCommand.email());

    UserModel userUpdated = userRepositoryPort.save(userFound.user());
    log.info("User updated successfully. id={}", userUpdated.getId());

    return new UserWithTaskCount(userUpdated, userFound.countTasks());
  }

  @Transactional
  public void delete(UUID id, boolean force) {
    UserWithTaskCount userFound = getById(id);

    if (force) {
      // 1. Si tiene tareas y force=true, eliminamos sus tareas primero
      if (userFound.countTasks() > 0) {
        taskRepositoryPort.deleteAllByUserId(id);
      }
      // 2. Eliminamos el usuario
      userRepositoryPort.delete(id);
    } else {
      // Si force=false y tiene tareas, al intentar borrar el repositorio
      // saltará la DataIntegrityViolationException y la traducirá al 409 Conflict
      userRepositoryPort.delete(id);
    }

    userRepositoryPort.delete(userFound.user().getId());
    log.info("User deleted successfully. id={}", userFound.user().getId());
  }


}
