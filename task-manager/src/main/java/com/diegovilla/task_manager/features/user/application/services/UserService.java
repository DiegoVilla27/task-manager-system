package com.diegovilla.task_manager.features.user.application.services;

import com.diegovilla.task_manager.core.errors.exceptions.ResourceNotFoundException;
import com.diegovilla.task_manager.core.security.jwt.ports.AuthenticatedUserProvider;
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

/**
 * Application service orchestrating user management use cases.
 *
 * <p>Handles user queries with pagination and security scoping, self-profile lookups,
 * secure user registration with password hashing, profile updates, and cascade or restricted user deletion.</p>
 *
 * @since 1.0.0
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

  private final UserRepositoryPort userRepositoryPort;
  private final PasswordHasherPort passwordHasherPort;
  private final PermissionValidator permissionValidator;
  private final AuthenticatedUserProvider authenticatedUserProvider;
  private final TaskRepositoryPort taskRepositoryPort;

  /**
   * Retrieves a paginated and filtered list of users along with their task counts.
   *
   * @param userPaginationCommand pagination parameters (page index and limit).
   * @param filters               search and filtering criteria.
   * @return a {@link Page} of {@link UserWithTaskCount} composite projections.
   */
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

  /**
   * Retrieves profile and task count information for the currently authenticated user.
   *
   * @return the resolved {@link UserWithTaskCount} of the authenticated principal.
   * @throws ResourceNotFoundException if user record cannot be found.
   */
  public UserWithTaskCount getMe() {
    UUID userId = authenticatedUserProvider.getCurrentUserId();
    return getById(userId);
  }

  /**
   * Retrieves a single user and their task count by unique identifier, validating authorization permissions.
   *
   * @param id unique identifier (UUID) of the user.
   * @return the {@link UserWithTaskCount} if found and authorized.
   * @throws ResourceNotFoundException if no user exists with the given ID.
   */
  public UserWithTaskCount getById(UUID id) {
    UserWithTaskCount userFound = userRepositoryPort.getById(id)
      .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    permissionValidator.validateHasPermissions(userFound.user().getId());

    log.info("User retrieved successfully. id={}", userFound.user().getId());

    return userFound;
  }

  /**
   * Creates and persists a new user account with hashed credentials.
   *
   * @param userCreateCommand command containing user details and plain-text password.
   * @return a {@link UserWithTaskCount} representing the created user with 0 tasks.
   * @throws UserAlreadyExistsException if a user with the normalized email already exists.
   */
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

  /**
   * Partially updates an existing user profile.
   *
   * @param id                unique identifier of the user to update.
   * @param userUpdateCommand command carrying updated profile attributes.
   * @return the updated {@link UserWithTaskCount}.
   * @throws ResourceNotFoundException  if the user does not exist.
   * @throws UserAlreadyExistsException if the new email belongs to another existing user.
   */
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

  /**
   * Deletes a user account permanently, with optional cascade deletion of assigned tasks.
   *
   * @param id    unique identifier of the user to delete.
   * @param force if {@code true}, removes all associated tasks prior to deleting user.
   * @throws ResourceNotFoundException if user does not exist.
   */
  @Transactional
  public void delete(UUID id, boolean force) {
    UserWithTaskCount userFound = getById(id);

    if (force) {
      // 1. Si tiene tareas y force=true, eliminamos sus tareas primero
      if (userFound.countTasks() > 0) {
        taskRepositoryPort.deleteAllByUserId(id);
      }
    }

    userRepositoryPort.delete(userFound.user().getId());
    log.info("User deleted successfully. id={}", userFound.user().getId());
  }
}

