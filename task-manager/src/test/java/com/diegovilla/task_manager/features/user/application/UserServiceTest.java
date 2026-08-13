package com.diegovilla.task_manager.features.user.application;

import com.diegovilla.task_manager.core.errors.exceptions.ResourceNotFoundException;
import com.diegovilla.task_manager.features.user.application.commands.UserCreateCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserFiltersCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserPaginationCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserUpdateCommand;
import com.diegovilla.task_manager.features.user.application.dto.response.UserWithTaskCount;
import com.diegovilla.task_manager.features.user.application.ports.PasswordHasherPort;
import com.diegovilla.task_manager.features.user.application.ports.UserRepositoryPort;
import com.diegovilla.task_manager.features.user.application.services.UserService;
import com.diegovilla.task_manager.features.user.domain.exceptions.UserAlreadyExistsException;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.domain.valueobjects.UserRole;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserFiltersDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
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
  private UserRepositoryPort userRepository;

  @Mock
  private PasswordHasherPort passwordHasher;

  @InjectMocks
  private UserService userService;

  @Test
  @DisplayName("Should retrieve all users successfully")
  void shouldGetAllUsers() {
    UserFiltersCommand filters = new UserFiltersCommand(null, null);
    UserPaginationCommand command = new UserPaginationCommand(1, 10);
    Pageable pageable = PageRequest.of(command.page(), command.limit());

    List<UserWithTaskCount> users = List.of(
      new UserWithTaskCount(
        UserModel.create("John", "Doe", "john.doe@example.com", "12345"),
        10L
      ),
      new UserWithTaskCount(
        UserModel.create("John 1", "Doe", "john.doe1@example.com", "12345"),
        10L
      ),
      new UserWithTaskCount(
        UserModel.create("John 2", "Doe", "john.doe2@example.com", "12345"),
        10L
      )
    );

    Page<UserWithTaskCount> userPage = new PageImpl<>(users, pageable, users.size());

    when(userRepository.getAll(pageable, filters)).thenReturn(userPage);

    Page<UserWithTaskCount> usersResponse = userService.getAll(command, filters);

    assertThat(usersResponse).isSameAs(userPage);
    verify(userRepository).getAll(pageable, filters);
  }

  @Test
  @DisplayName("Should retrieve a user by its ID successfully")
  void shouldGetUserById() {
    UUID userId = UUID.randomUUID();
    UserWithTaskCount user = new UserWithTaskCount(
      UserModel.create("John", "Doe", "john.doe@example.com", "12345"),
      10L
    );

    when(userRepository.getById(userId)).thenReturn(Optional.of(user));

    UserWithTaskCount userFound = userService.getById(userId);

    assertThat(userFound).isSameAs(user);
    verify(userRepository).getById(userId);
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

    UserWithTaskCount userCreated = userService.create(command);

    assertThat(userCreated.user().getName()).isEqualTo(command.name());
    assertThat(userCreated.user().getPassword()).isEqualTo(hashPassword);

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
    UserWithTaskCount userFound = new UserWithTaskCount(
      UserModel.reconstruct(
        userId,
        "John",
        "Doe",
        "john.doe@example.com",
        "hash_12345",
        UserRole.USER,
        Instant.now(),
        Instant.now()
      ),
      10L
    );

    when(userRepository.getById(userId)).thenReturn(Optional.of(userFound));

    when(userRepository.existsByEmailIgnoreCase(command.email())).thenReturn(false);

    when(userRepository.save(userFound.user())).thenReturn(userFound.user());

    UserWithTaskCount userUpdated = userService.update(userId, command);

    assertThat(userUpdated.user().getName()).isEqualTo(command.name());

    verify(userRepository).getById(userId);
    verify(userRepository).existsByEmailIgnoreCase(command.email());
    verify(userRepository).save(userFound.user());
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
    UserWithTaskCount userFound = new UserWithTaskCount(
      UserModel.reconstruct(
        userId,
        "John",
        "Doe",
        "john.doe@example.com",
        "hash_12345",
        UserRole.USER,
        Instant.now(),
        Instant.now()
      ),
      10L
    );

    when(userRepository.getById(userId)).thenReturn(Optional.of(userFound));

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
    UUID userId = UUID.randomUUID();
    UserWithTaskCount userFound = new UserWithTaskCount(
      UserModel.reconstruct(
        userId,
        "John",
        "Doe",
        "john.doe@example.com",
        "hash_12345",
        UserRole.USER,
        Instant.now(),
        Instant.now()
      ),
      10L
    );

    when(userRepository.getById(userId)).thenReturn(Optional.of(userFound));

    doNothing().when(userRepository).delete(userId);

    userService.delete(userId, true);

    verify(userRepository).getById(userId);
    verify(userRepository).delete(userId);
  }
}
