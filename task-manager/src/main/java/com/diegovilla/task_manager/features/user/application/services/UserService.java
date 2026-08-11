package com.diegovilla.task_manager.features.user.application.services;

import com.diegovilla.task_manager.core.errors.exceptions.ResourceNotFoundException;
import com.diegovilla.task_manager.features.user.application.commands.UserCreateCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserUpdateCommand;
import com.diegovilla.task_manager.features.user.application.ports.PasswordHasher;
import com.diegovilla.task_manager.features.user.application.ports.UserRepository;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.domain.exceptions.UserAlreadyExistsException;
import com.diegovilla.task_manager.utils.data.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

  private final UserRepository userRepository;
  private final PasswordHasher passwordHasher;

  public List<UserModel> getAll() {
    List<UserModel> users = userRepository.getAll();
    log.info("Users retrieved successfully. size={}", users.size());

    return users;
  }

  public UserModel getById(UUID id) {
    UserModel userFound = userRepository.getById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    log.info("User retrieved successfully. id={}", userFound.getId());

    return userFound;
  }

  @Transactional
  public UserModel create(UserCreateCommand userCreateCommand) {
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

    return userCreated;
  }

  @Transactional
  public UserModel update(UUID id, UserUpdateCommand userUpdateCommand) {
    UserModel userFound = getById(id);

    String emailNormalized = StringUtils.normalize(userUpdateCommand.email());
    if (!userFound.getEmail().equals(emailNormalized)
        && userRepository.existsByEmailIgnoreCase(emailNormalized)) {
      throw new UserAlreadyExistsException();
    }

    userFound.updateInformation(
        userUpdateCommand.name(),
        userUpdateCommand.lastname(),
        userUpdateCommand.email());

    UserModel userUpdated = userRepository.save(userFound);
    log.info("User updated successfully. id={}", userUpdated.getId());

    return userUpdated;
  }

  @Transactional
  public void delete(UUID id) {
    UserModel userFound = getById(id);

    userRepository.delete(userFound.getId());
    log.info("User deleted successfully. id={}", userFound.getId());
  }
}
