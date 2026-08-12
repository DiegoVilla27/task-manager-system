package com.diegovilla.task_manager.core.security.seeders;

import com.diegovilla.task_manager.features.user.application.ports.PasswordHasherPort;
import com.diegovilla.task_manager.features.user.application.ports.UserRepositoryPort;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.domain.valueobjects.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;
import java.util.UUID;

@Configuration
@RequiredArgsConstructor
public class DatabaseSeeder {

  private final UserRepositoryPort userRepositoryPort;
  private final PasswordHasherPort passwordHasherPort;

  @Bean
  CommandLineRunner seedAdminUser() {
    return args -> {
      String email = "admin@taskmanager.com";

      if (userRepositoryPort.existsByEmailIgnoreCase(email)) {
        return;
      }

      String password = passwordHasherPort.hash("12345678");

      UserModel admin = UserModel.reconstruct(
        UUID.randomUUID(),
        "Diego",
        "Villa",
        email,
        password,
        UserRole.ADMIN,
        Instant.now(),
        Instant.now()
      );

      userRepositoryPort.save(admin);
    };
  }
}
