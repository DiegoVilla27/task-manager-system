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

/**
 * Database seeder component responsible for initializing default data upon application startup.
 *
 * <p>Ensures a default administrator account exists in the database if not already present.</p>
 *
 * @since 1.0.0
 */
@Configuration
@RequiredArgsConstructor
public class DatabaseSeeder {

  private final UserRepositoryPort userRepositoryPort;
  private final PasswordHasherPort passwordHasherPort;

  /**
   * Initializes the default administrative user account upon application context initialization.
   *
   * @return a {@link CommandLineRunner} callback executed after startup.
   */
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

