package com.diegovilla.task_manager.features.user.application;

import com.diegovilla.task_manager.core.errors.exceptions.ResourceNotFoundException;
import com.diegovilla.task_manager.features.user.application.commands.UserCreateCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserUpdateCommand;
import com.diegovilla.task_manager.features.user.application.ports.PasswordHasher;
import com.diegovilla.task_manager.features.user.application.ports.UserRepository;
import com.diegovilla.task_manager.features.user.application.services.UserService;
import com.diegovilla.task_manager.features.user.domain.exceptions.UserAlreadyExistsException;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

  @Mock
  private UserRepository userRepository;

  @Mock
  private PasswordHasher passwordHasher;

  @InjectMocks
  private UserService userService;

  @Test
  @DisplayName("Should retrieve all users successfully")
  void shouldGetAllUsers() {
    List<UserModel> users = List.of(
      UserModel.create("John", "Doe", "john.doe@example.com", "12345"),
      UserModel.create("John 1", "Doe 1", "john.doe1@example.com", "12345"),
      UserModel.create("John 2", "Doe 2", "john.doe2@example.com", "12345")
    );

    when(userRepository.getAll()).thenReturn(users);

    List<UserModel> usersResponse = userService.getAll();

    assertThat(usersResponse).isSameAs(users);
    verify(userRepository).getAll();
  }

  @Test
  @DisplayName("Should retrieve a user by its ID successfully")
  void shouldGetUserById() {
    UserModel user = UserModel.create("John", "Doe", "john.doe@example.com", "12345");

    when(userRepository.getById(user.getId())).thenReturn(Optional.of(user));

    UserModel userFound = userService.getById(user.getId());

    assertThat(userFound).isSameAs(user);
    verify(userRepository).getById(user.getId());
  }

  @Test
  @DisplayName("Should reject retrieving a user by its ID when not found")
  void shouldRejectGetUserById() {
    UUID userId = UUID.randomUUID();

    when(userRepository.getById(userId)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> userService.getById(userId))
      .isInstanceOf(ResourceNotFoundException.class)
      .hasMessage("User not found");

    verify(userRepository).getById(userId);
  }

  @Test
  @DisplayName("Should create a user successfully")
  void shouldCreateUser() {
    String plainPassword = "12345";
    String hashPassword = "hash_12345";
    UserCreateCommand command = new UserCreateCommand(
      "John",
      "Doe",
      "john.doe@example.com",
      plainPassword
    );

    when(userRepository.existsByEmailIgnoreCase(command.email())).thenReturn(false);

    when(passwordHasher.hash(command.password())).thenReturn(hashPassword);
    UserModel user = UserModel.create("John", "Doe", "john.doe@example.com", hashPassword);

    when(userRepository.save(any(UserModel.class))).thenReturn(user);

    UserModel userCreated = userService.create(command);

    assertThat(userCreated.getName()).isEqualTo(command.name());
    assertThat(userCreated.getPassword()).isEqualTo(hashPassword);

    verify(userRepository).existsByEmailIgnoreCase(command.email());
    verify(passwordHasher).hash(command.password());
    verify(userRepository).save(any(UserModel.class));
  }

  @Test
  @DisplayName("Should reject creating a user when it already exists")
  void shouldRejectCreateUserAlreadyExists() {
    UserCreateCommand command = new UserCreateCommand(
      "John",
      "Doe",
      "john.doe@example.com",
      "12345"
    );

    when(userRepository.existsByEmailIgnoreCase(command.email())).thenReturn(true);

    assertThatThrownBy(() -> userService.create(command))
      .isInstanceOf(UserAlreadyExistsException.class)
      .hasMessage("A user with this email already exists.");

    verify(userRepository).existsByEmailIgnoreCase(command.email());
  }

  @Test
  @DisplayName("Should update a user successfully")
  void shouldUpdateUser() {
    UUID userId = UUID.randomUUID();
    UserUpdateCommand command = new UserUpdateCommand(
      "John Updated",
      "Doe Updated",
      "john.updated@example.com"
    );
    UserModel user = UserModel.create("John", "Doe", "john.doe@example.com", "hash_12345");

    when(userRepository.getById(userId)).thenReturn(Optional.of(user));

    when(userRepository.existsByEmailIgnoreCase(command.email())).thenReturn(false);

    when(userRepository.save(user)).thenReturn(user);

    UserModel userUpdated = userService.update(userId, command);

    assertThat(userUpdated.getName()).isEqualTo(command.name());

    verify(userRepository).getById(userId);
    verify(userRepository).existsByEmailIgnoreCase(command.email());
    verify(userRepository).save(user);
  }

  @Test
  @DisplayName("Should reject updating a user when the new email already exists")
  void shouldRejectUpdateUserAlreadyExists() {
    UUID userId = UUID.randomUUID();
    UserUpdateCommand command = new UserUpdateCommand(
      "John Updated",
      "Doe Updated",
      "john.updated@example.com"
    );
    UserModel user = UserModel.create("John", "Doe", "john.doe@example.com", "hash_12345");

    when(userRepository.getById(userId)).thenReturn(Optional.of(user));

    when(userRepository.existsByEmailIgnoreCase(command.email())).thenReturn(true);

    assertThatThrownBy(() -> userService.update(userId, command))
      .isInstanceOf(UserAlreadyExistsException.class)
      .hasMessage("A user with this email already exists.");

    verify(userRepository).getById(userId);
    verify(userRepository).existsByEmailIgnoreCase(command.email());
  }

  @Test
  @DisplayName("Should delete a user successfully")
  void shouldDeleteUser() {
    UserModel user = UserModel.create("John", "Doe", "john.doe@example.com", "hash_12345");

    when(userRepository.getById(user.getId())).thenReturn(Optional.of(user));

    doNothing().when(userRepository).delete(user.getId());

    userService.delete(user.getId());

    verify(userRepository).getById(user.getId());
    verify(userRepository).delete(user.getId());
  }
}
