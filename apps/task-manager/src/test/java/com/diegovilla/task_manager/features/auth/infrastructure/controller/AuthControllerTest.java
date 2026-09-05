package com.diegovilla.task_manager.features.auth.infrastructure.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.diegovilla.task_manager.core.security.jwt.JwtModel;
import com.diegovilla.task_manager.features.auth.application.commands.AuthLoginCommand;
import com.diegovilla.task_manager.features.auth.application.commands.AuthRefreshCommand;
import com.diegovilla.task_manager.features.auth.application.commands.AuthRegisterCommand;
import com.diegovilla.task_manager.features.auth.application.service.AuthService;
import com.diegovilla.task_manager.features.auth.infrastructure.dto.request.AuthLoginRequestDTO;
import com.diegovilla.task_manager.features.auth.infrastructure.dto.request.AuthRefreshRequestDTO;
import com.diegovilla.task_manager.features.auth.infrastructure.dto.request.AuthRegisterRequestDTO;
import com.diegovilla.task_manager.features.auth.infrastructure.dto.response.AuthResponseDTO;
import com.diegovilla.task_manager.features.auth.infrastructure.mappers.AuthDtoMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock private AuthService authService;
    @Mock private AuthDtoMapper authDtoMapper;

    @InjectMocks private AuthController authController;

    @Test
    @DisplayName("Should login successfully and return AuthResponseDTO")
    void shouldLoginSuccessfully() {
        AuthLoginRequestDTO request = new AuthLoginRequestDTO("john@example.com", "Password123!");
        AuthLoginCommand command = new AuthLoginCommand("john@example.com", "Password123!");
        JwtModel jwtModel = new JwtModel("access_token", "refresh_token", 3600L);
        AuthResponseDTO responseDTO = new AuthResponseDTO("access_token", "refresh_token", 3600L);

        when(authDtoMapper.loginRequestDTOToCommand(request)).thenReturn(command);
        when(authService.login(command)).thenReturn(jwtModel);
        when(authDtoMapper.jwtModelToResponseDTO(jwtModel)).thenReturn(responseDTO);

        ResponseEntity<AuthResponseDTO> response = authController.login(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().access_token()).isEqualTo("access_token");
        assertThat(response.getBody().refresh_token()).isEqualTo("refresh_token");
        assertThat(response.getBody().expires_in()).isEqualTo(3600L);
    }

    @Test
    @DisplayName("Should register successfully and return AuthResponseDTO")
    void shouldRegisterSuccessfully() {
        AuthRegisterRequestDTO request =
                new AuthRegisterRequestDTO("John", "Doe", "john@example.com", "Password123!");
        AuthRegisterCommand command =
                new AuthRegisterCommand("John", "Doe", "john@example.com", "Password123!");
        JwtModel jwtModel = new JwtModel("access_token", "refresh_token", 3600L);
        AuthResponseDTO responseDTO = new AuthResponseDTO("access_token", "refresh_token", 3600L);

        when(authDtoMapper.registerRequestDTOToCommand(request)).thenReturn(command);
        when(authService.register(command)).thenReturn(jwtModel);
        when(authDtoMapper.jwtModelToResponseDTO(jwtModel)).thenReturn(responseDTO);

        ResponseEntity<AuthResponseDTO> response = authController.register(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().access_token()).isEqualTo("access_token");
    }

    @Test
    @DisplayName("Should refresh token successfully and return AuthResponseDTO")
    void shouldRefreshTokenSuccessfully() {
        AuthRefreshRequestDTO request = new AuthRefreshRequestDTO("valid_refresh_token");
        AuthRefreshCommand command = new AuthRefreshCommand("valid_refresh_token");
        JwtModel jwtModel = new JwtModel("new_access_token", "valid_refresh_token", 3600L);
        AuthResponseDTO responseDTO =
                new AuthResponseDTO("new_access_token", "valid_refresh_token", 3600L);

        when(authDtoMapper.refreshRequestDTOToCommand(request)).thenReturn(command);
        when(authService.refresh(command)).thenReturn(jwtModel);
        when(authDtoMapper.jwtModelToResponseDTO(jwtModel)).thenReturn(responseDTO);

        ResponseEntity<AuthResponseDTO> response = authController.refresh(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().access_token()).isEqualTo("new_access_token");
    }
}
