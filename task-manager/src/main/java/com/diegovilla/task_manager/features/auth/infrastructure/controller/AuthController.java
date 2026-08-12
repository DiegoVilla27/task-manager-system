package com.diegovilla.task_manager.features.auth.infrastructure.controller;

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
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final AuthDtoMapper authDtoMapper;

  @PostMapping("/login")
  public ResponseEntity<AuthResponseDTO> login(
    @Valid @RequestBody AuthLoginRequestDTO loginRequestDTO
  ) {
    AuthLoginCommand command = authDtoMapper.loginRequestDTOToCommand(loginRequestDTO);
    JwtModel res = authService.login(command);

    return ResponseEntity.ok(authDtoMapper.jwtModelToResponseDTO(res));
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponseDTO> register(
    @Valid @RequestBody AuthRegisterRequestDTO authRegisterRequestDTO
  ) {
    AuthRegisterCommand command = authDtoMapper.registerRequestDTOToCommand(authRegisterRequestDTO);
    JwtModel res = authService.register(command);

    return ResponseEntity.ok(authDtoMapper.jwtModelToResponseDTO(res));
  }

  @PostMapping("/refresh")
  public ResponseEntity<AuthResponseDTO> refresh(
    @Valid @RequestBody AuthRefreshRequestDTO authRefreshRequestDTO
  ) {
    AuthRefreshCommand command = authDtoMapper.refreshRequestDTOToCommand(authRefreshRequestDTO);
    JwtModel res = authService.refresh(command);

    return ResponseEntity.ok(authDtoMapper.jwtModelToResponseDTO(res));
  }
}
