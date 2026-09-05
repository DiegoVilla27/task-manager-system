package com.diegovilla.task_manager.features.user.infrastructure.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.diegovilla.task_manager.features.user.application.commands.UserCreateCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserFiltersCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserPaginationCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserUpdateCommand;
import com.diegovilla.task_manager.features.user.application.dto.response.UserWithTaskCount;
import com.diegovilla.task_manager.features.user.application.services.UserService;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.domain.valueobjects.UserRole;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserCreateRequestDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserFiltersDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserUpdateRequestDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.response.UserMeResponseDTO;
import com.diegovilla.task_manager.features.user.infrastructure.dto.response.UserWithTaskCountResponseDTO;
import com.diegovilla.task_manager.features.user.infrastructure.mappers.UserDtoMapper;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock private UserService userService;
    @Mock private UserDtoMapper userDtoMapper;

    @InjectMocks private UserController userController;

    private UUID userId;
    private UserModel userModel;
    private UserWithTaskCount userWithTaskCount;
    private UserWithTaskCountResponseDTO userResponseDTO;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        userModel =
                UserModel.reconstruct(
                        userId,
                        "Alice",
                        "Smith",
                        "alice@example.com",
                        "hashed_pass",
                        UserRole.USER,
                        Instant.now(),
                        Instant.now());

        userWithTaskCount = new UserWithTaskCount(userModel, 3L);
        userResponseDTO =
                new UserWithTaskCountResponseDTO(
                        userId, "Alice", "Smith", "alice@example.com", 3L, Instant.now());
    }

    @Test
    @DisplayName("Should retrieve current authenticated user details")
    void shouldGetMe() {
        when(userService.getMe()).thenReturn(userWithTaskCount);

        ResponseEntity<UserMeResponseDTO> response = userController.getMe();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().id()).isEqualTo(userId);
        assertThat(response.getBody().email()).isEqualTo("alice@example.com");
    }

    @Test
    @DisplayName("Should retrieve all users paginated")
    void shouldGetAllUsers() {
        UserFiltersDTO filtersDTO = new UserFiltersDTO("Alice", userId);
        UserFiltersCommand filtersCommand = new UserFiltersCommand("Alice", userId);
        Page<UserWithTaskCount> page = new PageImpl<>(List.of(userWithTaskCount));

        when(userDtoMapper.filtersRequestDTOToCommand(filtersDTO)).thenReturn(filtersCommand);
        when(userService.getAll(any(UserPaginationCommand.class), eq(filtersCommand)))
                .thenReturn(page);
        when(userDtoMapper.modelToWithTasksResponseDTO(userWithTaskCount))
                .thenReturn(userResponseDTO);

        ResponseEntity<Page<UserWithTaskCountResponseDTO>> response =
                userController.getAll(1, 10, filtersDTO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getContent()).hasSize(1);
    }

    @Test
    @DisplayName("Should retrieve user by id")
    void shouldGetUserById() {
        when(userService.getById(userId)).thenReturn(userWithTaskCount);
        when(userDtoMapper.modelToWithTasksResponseDTO(userWithTaskCount))
                .thenReturn(userResponseDTO);

        ResponseEntity<UserWithTaskCountResponseDTO> response = userController.getById(userId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().id()).isEqualTo(userId);
    }

    @Test
    @DisplayName("Should create user successfully")
    void shouldCreateUser() {
        UserCreateRequestDTO request =
                new UserCreateRequestDTO("Alice", "Smith", "alice@example.com", "Password123!");
        UserCreateCommand command =
                new UserCreateCommand("Alice", "Smith", "alice@example.com", "Password123!");

        when(userDtoMapper.createRequestDTOToCommand(request)).thenReturn(command);
        when(userService.create(command)).thenReturn(userWithTaskCount);
        when(userDtoMapper.modelToWithTasksResponseDTO(userWithTaskCount))
                .thenReturn(userResponseDTO);

        ResponseEntity<UserWithTaskCountResponseDTO> response = userController.create(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().id()).isEqualTo(userId);
    }

    @Test
    @DisplayName("Should update user successfully")
    void shouldUpdateUser() {
        UserUpdateRequestDTO request =
                new UserUpdateRequestDTO(
                        "AliceUpdated", "SmithUpdated", "alice.updated@example.com");
        UserUpdateCommand command =
                new UserUpdateCommand("AliceUpdated", "SmithUpdated", "alice.updated@example.com");

        when(userDtoMapper.updateRequestDTOToCommand(request)).thenReturn(command);
        when(userService.update(userId, command)).thenReturn(userWithTaskCount);
        when(userDtoMapper.modelToWithTasksResponseDTO(userWithTaskCount))
                .thenReturn(userResponseDTO);

        ResponseEntity<UserWithTaskCountResponseDTO> response =
                userController.update(userId, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
    }

    @Test
    @DisplayName("Should delete user successfully")
    void shouldDeleteUser() {
        ResponseEntity<Void> response = userController.delete(userId, true);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(userService).delete(userId, true);
    }
}
