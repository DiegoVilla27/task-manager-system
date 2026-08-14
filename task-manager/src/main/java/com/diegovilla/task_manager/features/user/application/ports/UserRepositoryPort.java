package com.diegovilla.task_manager.features.user.application.ports;

import com.diegovilla.task_manager.features.user.application.commands.UserFiltersCommand;
import com.diegovilla.task_manager.features.user.application.dto.response.UserWithTaskCount;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

/**
 * Outbound persistence port interface for {@link UserModel} persistence operations.
 *
 * <p>Defines abstraction contracts for database access, decoupling domain logic
 * from concrete ORM and persistence technologies.</p>
 *
 * @since 1.0.0
 */
public interface UserRepositoryPort {

  /**
   * Checks whether a user with the specified email address already exists.
   *
   * @param email normalized email address to check.
   * @return {@code true} if a user exists with this email; {@code false} otherwise.
   */
  boolean existsByEmailIgnoreCase(String email);

  /**
   * Retrieves a paginated list of users with associated task counts matching optional filter criteria.
   *
   * @param pageable pagination parameters (page number and page size).
   * @param filters  query filter criteria.
   * @return a {@link Page} of {@link UserWithTaskCount} composite projections.
   */
  Page<UserWithTaskCount> getAll(Pageable pageable, UserFiltersCommand filters);

  /**
   * Retrieves a single user and their task count by unique identifier.
   *
   * @param id unique identifier (UUID) of the user.
   * @return an {@link Optional} containing the {@link UserWithTaskCount} if found, or empty.
   */
  Optional<UserWithTaskCount> getById(UUID id);

  /**
   * Retrieves a user domain model by email address.
   *
   * @param email email address to search for.
   * @return an {@link Optional} containing the {@link UserModel} if found, or empty.
   */
  Optional<UserModel> getByEmail(String email);

  /**
   * Persists a new or updated user domain model.
   *
   * @param userModel domain model representing the user to save.
   * @return the saved {@link UserModel} with persisted values.
   */
  UserModel save(UserModel userModel);

  /**
   * Permanently deletes a user by unique identifier.
   *
   * @param id unique identifier (UUID) of the user to delete.
   */
  void delete(UUID id);
}

