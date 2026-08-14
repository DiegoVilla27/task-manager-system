package com.diegovilla.task_manager.features.user.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

import com.diegovilla.task_manager.features.user.domain.valueobjects.UserRole;
import com.diegovilla.task_manager.utils.data.ValidateDataUtils;
import lombok.Getter;

/**
 * Domain aggregate root representing a User account within the platform.
 *
 * <p>Encapsulates user identity, profile names, email validation, password credentials,
 * authorization role, and audit timestamps.</p>
 *
 * @since 1.0.0
 */
@Getter
public class UserModel {
  private final UUID id;
  private String name;
  private String lastname;
  private String email;
  private String password;
  private UserRole role;
  private final Instant createdAt;
  private Instant updatedAt;

  private static final Pattern EMAIL_PATTERN = Pattern
    .compile("^(?=.{1,150}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

  /**
   * Internal constructor creating a hydrated {@link UserModel}.
   */
  private UserModel(
    UUID id,
    String name,
    String lastname,
    String email,
    String password,
    UserRole role,
    Instant createdAt,
    Instant updatedAt) {
    this.id = Objects.requireNonNull(id, "User ID cannot be null");
    this.name = Objects.requireNonNull(name, "User Name cannot be null").trim();
    this.lastname = Objects.requireNonNull(lastname, "User Lastname cannot be null").trim();
    this.email = Objects.requireNonNull(email, "User Email cannot be null").trim();
    this.password = Objects.requireNonNull(password, "User Password cannot be null").trim();
    this.role = Objects.requireNonNull(role, "User Role cannot be null");
    this.createdAt = Objects.requireNonNull(createdAt, "User CreatedAt cannot be null");
    this.updatedAt = Objects.requireNonNull(updatedAt, "User UpdatedAt cannot be null");
  }

  /**
   * Factory method creating a new user with standard {@link UserRole#USER} role.
   *
   * @param name     first name (3–100 characters).
   * @param lastname last name (3–100 characters).
   * @param email    valid email address format.
   * @param password hashed or raw password.
   * @return a new {@link UserModel} with generated UUID and current timestamps.
   */
  public static UserModel create(
    String name,
    String lastname,
    String email,
    String password) {
    name = ValidateDataUtils.required(name, 3, 100, "Name");
    lastname = ValidateDataUtils.required(lastname, 3, 100, "Lastname");
    email = ValidateDataUtils.required(email, EMAIL_PATTERN, "Email");
    password = ValidateDataUtils.required(password, "Password");

    return new UserModel(
      UUID.randomUUID(),
      name,
      lastname,
      email,
      password,
      UserRole.USER,
      Instant.now(),
      Instant.now());
  }

  /**
   * Reconstructs an existing {@link UserModel} from persistence without re-validating domain constraints.
   *
   * @param id        user unique identifier.
   * @param name      user first name.
   * @param lastname  user last name.
   * @param email     user email address.
   * @param password  user password hash.
   * @param role      user role enum value.
   * @param createdAt creation timestamp.
   * @param updatedAt last update timestamp.
   * @return a hydrated {@link UserModel} instance.
   */
  public static UserModel reconstruct(
    UUID id,
    String name,
    String lastname,
    String email,
    String password,
    UserRole role,
    Instant createdAt,
    Instant updatedAt) {
    return new UserModel(
      Objects.requireNonNull(id, "User ID cannot be null"),
      Objects.requireNonNull(name, "User Name cannot be null"),
      Objects.requireNonNull(lastname, "User Lastname cannot be null"),
      Objects.requireNonNull(email, "User Email cannot be null"),
      Objects.requireNonNull(password, "User Password cannot be null"),
      Objects.requireNonNull(role, "User Role cannot be null"),
      Objects.requireNonNull(createdAt, "User CreatedAt cannot be null"),
      Objects.requireNonNull(updatedAt, "User UpdatedAt cannot be null"));
  }

  /**
   * Updates mutable profile attributes if non-null values are provided.
   *
   * @param name     updated first name (3–100 chars), or {@code null} to preserve current.
   * @param lastname updated last name (3–100 chars), or {@code null} to preserve current.
   * @param email    updated valid email address, or {@code null} to preserve current.
   */
  public void updateInformation(
    String name,
    String lastname,
    String email) {
    this.name = ValidateDataUtils.updateIfPresent(name, this.name, 3, 100, "Name");
    this.lastname = ValidateDataUtils.updateIfPresent(lastname, this.lastname, 3, 100, "Lastname");
    this.email = ValidateDataUtils.updateIfPresent(email, this.email, EMAIL_PATTERN, "Email");
    this.updatedAt = Instant.now();
  }
}

