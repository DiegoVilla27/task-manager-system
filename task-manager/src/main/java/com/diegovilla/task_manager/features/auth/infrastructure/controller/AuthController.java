package com.diegovilla.task_manager.features.auth.infrastructure.controller;

import com.diegovilla.task_manager.core.security.jwt.JwtModel;
import com.diegovilla.task_manager.features.auth.application.commands.AuthLoginCommand;
import com.diegovilla.task_manager.features.auth.application.commands.AuthRefreshCommand;
import com.diegovilla.task_manager.features.auth.application.commands.AuthRegisterCommand;
import com.diegovilla.task_manager.features.auth.application.service.AuthService;
import com.diegovilla.task_manager.features.auth.infrastructure.docs.AuthLoginDocumentation;
import com.diegovilla.task_manager.features.auth.infrastructure.docs.AuthRefreshDocumentation;
import com.diegovilla.task_manager.features.auth.infrastructure.docs.AuthRegisterDocumentation;
import com.diegovilla.task_manager.features.auth.infrastructure.dto.request.AuthLoginRequestDTO;
import com.diegovilla.task_manager.features.auth.infrastructure.dto.request.AuthRefreshRequestDTO;
import com.diegovilla.task_manager.features.auth.infrastructure.dto.request.AuthRegisterRequestDTO;
import com.diegovilla.task_manager.features.auth.infrastructure.dto.response.AuthResponseDTO;
import com.diegovilla.task_manager.features.auth.infrastructure.mappers.AuthDtoMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller exposing authentication and identity management operations.
 *
 * <p>Provides public endpoints for user login, new account registration, and JWT token refresh.</p>
 *
 * @since 1.0.0
 */
@Validated
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Exposes operations for user registration, authentication, and token management.")
public class AuthController {

  private final AuthService authService;
  private final AuthDtoMapper authDtoMapper;

  /**
   * Authenticates user credentials and returns JWT access and refresh tokens.
   *
   * @param loginRequestDTO validated login credentials payload.
   * @return HTTP 200 with {@link AuthResponseDTO} containing issued tokens.
   */
  @PostMapping("/login")
  @AuthLoginDocumentation
  public ResponseEntity<AuthResponseDTO> login(
    @Valid @RequestBody AuthLoginRequestDTO loginRequestDTO
  ) {
    AuthLoginCommand command = authDtoMapper.loginRequestDTOToCommand(loginRequestDTO);
    JwtModel res = authService.login(command);

    return ResponseEntity.ok(authDtoMapper.jwtModelToResponseDTO(res));
  }

  /**
   * Registers a new user account and returns initial JWT tokens.
   *
   * @param authRegisterRequestDTO validated registration data payload.
   * @return HTTP 200 with {@link AuthResponseDTO} containing issued tokens.
   */
  @PostMapping("/register")
  @AuthRegisterDocumentation
  public ResponseEntity<AuthResponseDTO> register(
    @Valid @RequestBody AuthRegisterRequestDTO authRegisterRequestDTO
  ) {
    AuthRegisterCommand command = authDtoMapper.registerRequestDTOToCommand(authRegisterRequestDTO);
    JwtModel res = authService.register(command);

    return ResponseEntity.ok(authDtoMapper.jwtModelToResponseDTO(res));
  }

  /**
   * Generates a new access token using a valid refresh token.
   *
   * @param authRefreshRequestDTO validated refresh token request payload.
   * @return HTTP 200 with {@link AuthResponseDTO} containing renewed tokens.
   */
  @PostMapping("/refresh")
  @AuthRefreshDocumentation
  public ResponseEntity<AuthResponseDTO> refresh(
    @Valid @RequestBody AuthRefreshRequestDTO authRefreshRequestDTO
  ) {
    AuthRefreshCommand command = authDtoMapper.refreshRequestDTOToCommand(authRefreshRequestDTO);
    JwtModel res = authService.refresh(command);

    return ResponseEntity.ok(authDtoMapper.jwtModelToResponseDTO(res));
  }
}

