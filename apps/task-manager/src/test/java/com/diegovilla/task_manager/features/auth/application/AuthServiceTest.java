package com.diegovilla.task_manager.features.auth.application;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.diegovilla.task_manager.core.security.jwt.JwtModel;
import com.diegovilla.task_manager.core.security.jwt.JwtService;
import com.diegovilla.task_manager.features.auth.application.commands.AuthLoginCommand;
import com.diegovilla.task_manager.features.auth.application.commands.AuthRefreshCommand;
import com.diegovilla.task_manager.features.auth.application.commands.AuthRegisterCommand;
import com.diegovilla.task_manager.features.auth.application.service.AuthService;
import com.diegovilla.task_manager.features.user.application.commands.UserCreateCommand;
import com.diegovilla.task_manager.features.user.application.dto.response.UserWithTaskCount;
import com.diegovilla.task_manager.features.user.application.ports.PasswordHasherPort;
import com.diegovilla.task_manager.features.user.application.ports.UserRepositoryPort;
import com.diegovilla.task_manager.features.user.application.services.UserService;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.domain.valueobjects.UserRole;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepositoryPort userRepositoryPort;

    @Mock private PasswordHasherPort passwordHasherPort;

    @Mock private UserService userService;

    @Mock private JwtService jwtService;

    @InjectMocks AuthService authService;

    @Test
    @DisplayName("Should login user successfully")
    void shouldLoginSuccessfully() {
        AuthLoginCommand command = new AuthLoginCommand("dv@mail.com", "12345678");
        UserModel userFound =
                UserModel.reconstruct(
                        UUID.randomUUID(),
                        "Diego",
                        "Villa",
                        "dv@gmail.com",
                        "hash_12345678",
                        UserRole.USER,
                        Instant.now(),
                        Instant.now());
        JwtModel tokens = new JwtModel("access_token", "refresh_token", 3600L);

        when(userRepositoryPort.getByEmail(command.email())).thenReturn(Optional.of(userFound));

        when(passwordHasherPort.matches(command.password(), userFound.getPassword()))
                .thenReturn(true);

        when(jwtService.generateToken(userFound.getId().toString(), UserRole.USER))
                .thenReturn(tokens);

        JwtModel res = authService.login(command);

        assertThat(res).isSameAs(tokens);

        verify(userRepositoryPort).getByEmail(command.email());
        verify(passwordHasherPort).matches(command.password(), userFound.getPassword());
        verify(jwtService).generateToken(userFound.getId().toString(), UserRole.USER);
    }

    @Test
    @DisplayName("Should reject login if user doesnt exists")
    void shouldRejectLoginIfUserDoesntExists() {
        AuthLoginCommand command = new AuthLoginCommand("dv@mail.com", "12345678");

        when(userRepositoryPort.getByEmail(command.email())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(command))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Invalid email or password");

        verify(userRepositoryPort).getByEmail(command.email());
        verify(jwtService, never()).generateToken(any(), any());
    }

    @Test
    @DisplayName("Should reject login is mismatch is not equal")
    void shouldRejectLoginIfMismatchFalse() {
        AuthLoginCommand command = new AuthLoginCommand("dv@mail.com", "12345678");
        UserModel userFound =
                UserModel.reconstruct(
                        UUID.randomUUID(),
                        "Diego",
                        "Villa",
                        "dv@gmail.com",
                        "hash_12345678",
                        UserRole.USER,
                        Instant.now(),
                        Instant.now());

        when(userRepositoryPort.getByEmail(command.email())).thenReturn(Optional.of(userFound));
        when(passwordHasherPort.matches(command.password(), userFound.getPassword()))
                .thenReturn(false);

        assertThatThrownBy(() -> authService.login(command))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Invalid email or password");

        verify(userRepositoryPort).getByEmail(command.email());
        verify(jwtService, never()).generateToken(any(), any());
    }

    @Test
    void shouldRegisterSuccessfully() {
        AuthRegisterCommand command =
                new AuthRegisterCommand("Diego", "Villa", "dv@gmail.com", "12345678");
        UserCreateCommand userCreateCommand =
                new UserCreateCommand(
                        command.name(), command.lastname(), command.email(), command.password());
        UserWithTaskCount userWithTaskCount =
                new UserWithTaskCount(
                        UserModel.reconstruct(
                                UUID.randomUUID(),
                                userCreateCommand.name(),
                                userCreateCommand.lastname(),
                                userCreateCommand.email(),
                                userCreateCommand.password(),
                                UserRole.USER,
                                Instant.now(),
                                Instant.now()),
                        0L);

        JwtModel tokens = new JwtModel("access_token", "refresh_token", 3600L);

        when(userService.create(userCreateCommand)).thenReturn(userWithTaskCount);
        when(jwtService.generateToken(userWithTaskCount.user().getId().toString(), UserRole.USER))
                .thenReturn(tokens);

        JwtModel res = authService.register(command);

        assertThat(res).isSameAs(tokens);

        verify(userService).create(userCreateCommand);
        verify(jwtService)
                .generateToken(userWithTaskCount.user().getId().toString(), UserRole.USER);
    }

    @Test
    @DisplayName("Should refresh successfully")
    void shouldRefreshSuccessfully() {
        UUID userId = UUID.randomUUID();
        AuthRefreshCommand command = new AuthRefreshCommand("refresh_token1");
        JwtModel tokens = new JwtModel("access_token", "refresh_token2", 3600L);

        when(jwtService.isValid(command.refresh_token(), false)).thenReturn(true);
        when(jwtService.extractSubject(command.refresh_token(), false))
                .thenReturn(userId.toString());
        when(jwtService.extractRole(command.refresh_token())).thenReturn("USER");
        when(jwtService.generateToken(userId.toString(), UserRole.USER)).thenReturn(tokens);

        JwtModel res = authService.refresh(command);

        assertThat(res).isNotNull();
        assertThat(res.refresh_token()).isNotEqualTo(command.refresh_token());

        verify(jwtService).generateToken(userId.toString(), UserRole.USER);
    }

    @Test
    @DisplayName("Should reject refresh if not valid")
    void shouldRejectRefreshIfNotValid() {
        AuthRefreshCommand command = new AuthRefreshCommand("refresh_token1");

        when(jwtService.isValid(command.refresh_token(), false)).thenReturn(false);

        assertThatThrownBy(() -> authService.refresh(command))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Invalid or expired refresh token");

        verify(jwtService, never()).generateToken(any(), any());
    }
}
