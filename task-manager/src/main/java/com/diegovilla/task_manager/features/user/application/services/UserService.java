package com.diegovilla.task_manager.features.user.application.services;

import com.diegovilla.task_manager.core.errors.exceptions.ResourceNotFoundException;
import com.diegovilla.task_manager.features.user.application.commands.UserCreateCommand;
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

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

  private final UserRepositoryPort userRepository;
  private final PasswordHasherPort passwordHasher;

  public Page<UserWithTaskCount> getAll(UserPaginationCommand userPaginationCommand) {
    Pageable pageable = PageRequest.of(userPaginationCommand.page(), userPaginationCommand.limit());

    Page<UserWithTaskCount> users = userRepository.getAll(pageable, userPaginationCommand.filters());
    log.info("Users retrieved successfully. size={}", users.getContent().size());

    return users;
  }

  public UserWithTaskCount getById(UUID id) {
    UserWithTaskCount userFound = userRepository.getById(id)
      .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    log.info("User retrieved successfully. id={}", userFound.user().getId());

    return userFound;
  }

  @Transactional
  public UserWithTaskCount create(UserCreateCommand userCreateCommand) {
    if (userRepository
      .existsByEmailIgnoreCase(StringUtils.normalize(userCreateCommand.email()))) {
      throw new UserAlreadyExistsException();
    }

    String passwordHash = passwordHasher.hash(userCreateCommand.password());

    UserModel user = UserModel.create(
      userCreateCommand.name(),
      userCreateCommand.lastname(),
      userCreateCommand.email(),
      passwordHash);

    UserModel userCreated = userRepository.save(user);
    log.info("User created successfully. id={}", userCreated.getId());

    return new UserWithTaskCount(userCreated, 0L);
  }

  @Transactional
  public UserWithTaskCount update(UUID id, UserUpdateCommand userUpdateCommand) {
    UserWithTaskCount userFound = getById(id);

    String emailNormalized = StringUtils.normalize(userUpdateCommand.email());
    if (!userFound.user().getEmail().equals(emailNormalized)
      && userRepository.existsByEmailIgnoreCase(emailNormalized)) {
      throw new UserAlreadyExistsException();
    }

    userFound.user().updateInformation(
      userUpdateCommand.name(),
      userUpdateCommand.lastname(),
      userUpdateCommand.email());

    UserModel userUpdated = userRepository.save(userFound.user());
    log.info("User updated successfully. id={}", userUpdated.getId());

    return new UserWithTaskCount(userUpdated, userFound.countTasks());
  }

  @Transactional
  public void delete(UUID id) {
    UserWithTaskCount userFound = getById(id);

    userRepository.delete(userFound.user().getId());
    log.info("User deleted successfully. id={}", userFound.user().getId());
  }
}
