package com.diegovilla.task_manager.features.auth.application.service;

import com.diegovilla.task_manager.core.security.jwt.JwtModel;
import com.diegovilla.task_manager.core.security.jwt.JwtService;
import com.diegovilla.task_manager.features.auth.application.commands.AuthLoginCommand;
import com.diegovilla.task_manager.features.auth.application.commands.AuthRefreshCommand;
import com.diegovilla.task_manager.features.auth.application.commands.AuthRegisterCommand;
import com.diegovilla.task_manager.features.user.application.commands.UserCreateCommand;
import com.diegovilla.task_manager.features.user.application.dto.response.UserWithTaskCount;
import com.diegovilla.task_manager.features.user.application.ports.PasswordHasherPort;
import com.diegovilla.task_manager.features.user.application.ports.UserRepositoryPort;
import com.diegovilla.task_manager.features.user.application.services.UserService;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.domain.valueobjects.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepositoryPort userRepositoryPort;
  private final PasswordHasherPort passwordHasherPort;
  private final JwtService jwtService;
  private final UserService userService;

  public JwtModel login(AuthLoginCommand command) {
    UserModel userFound = userRepositoryPort
      .getByEmail(command.email())
      .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

    if (!passwordHasherPort.matches(command.password(), userFound.getPassword())) {
      throw new BadCredentialsException("Invalid email or password");
    }

    return jwtService.generateToken(userFound.getId().toString(), userFound.getRole());
  }

  public JwtModel register(AuthRegisterCommand command) {
    UserCreateCommand userCreateCommand = new UserCreateCommand(
      command.name(),
      command.lastname(),
      command.email(),
      command.password()
    );
    UserWithTaskCount userCreated = userService.create(userCreateCommand);

    return jwtService.generateToken(userCreated.user().getId().toString(), userCreated.user().getRole());
  }

  public JwtModel refresh(AuthRefreshCommand command) {
    if (!jwtService.isValid(command.refresh_token(), false)) {
      throw new BadCredentialsException("Invalid or expired refresh token");
    }

    String userId = jwtService.extractSubject(command.refresh_token(), false);
    UserRole userRole = UserRole.valueOf(jwtService.extractRole(command.refresh_token()));

    return jwtService.generateToken(userId, userRole);
  }
}
