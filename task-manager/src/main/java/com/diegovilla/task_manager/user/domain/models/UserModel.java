package com.diegovilla.task_manager.user.domain.models;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

import com.diegovilla.task_manager.utils.data.ValidateDataUtils;
import lombok.Getter;

@Getter
public class UserModel {
  private final UUID id;
  private String name;
  private String lastname;
  private String email;
  private String password;
  private final Instant createdAt;
  private Instant updatedAt;

  private static final Pattern EMAIL_PATTERN =
    Pattern.compile("^(?=.{1,150}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

  private UserModel(
    UUID id,
    String name,
    String lastname,
    String email,
    String password,
    Instant createdAt,
    Instant updatedAt
  ) {
    this.id = Objects.requireNonNull(id, "User ID cannot be null");
    this.name = Objects.requireNonNull(name, "User Name cannot be null").trim();
    this.lastname = Objects.requireNonNull(lastname, "User Lastname cannot be null").trim();
    this.email = Objects.requireNonNull(email, "User Email cannot be null").trim();
    this.password = Objects.requireNonNull(password, "User Password cannot be null").trim();
    this.createdAt = Objects.requireNonNull(createdAt, "User CreatedAt cannot be null");
    this.updatedAt = Objects.requireNonNull(updatedAt, "User UpdatedAt cannot be null");
  }

  public static UserModel create(
    String name,
    String lastname,
    String email,
    String password
  ) {
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
      Instant.now(),
      Instant.now()
    );
  }

  public static UserModel reconstruct(
    UUID id,
    String name,
    String lastname,
    String email,
    String password,
    Instant createdAt,
    Instant updatedAt
  ) {
    return new UserModel(
      Objects.requireNonNull(id, "User ID cannot be null"),
      Objects.requireNonNull(name, "User Name cannot be null"),
      Objects.requireNonNull(lastname, "User Lastname cannot be null"),
      Objects.requireNonNull(email, "User Email cannot be null"),
      Objects.requireNonNull(password, "User Password cannot be null"),
      Objects.requireNonNull(createdAt, "User CreatedAt cannot be null"),
      Objects.requireNonNull(updatedAt, "User UpdatedAt cannot be null")
    );
  }

  public void updateInformation(
    String name,
    String lastname,
    String email
  ) {
    this.name = ValidateDataUtils.updateIfPresent(name, this.name, 3, 100, "Name");
    this.lastname = ValidateDataUtils.updateIfPresent(lastname, this.lastname, 3, 100, "Lastname");
    this.email = ValidateDataUtils.updateIfPresent(email, this.email, EMAIL_PATTERN, "Email");
    this.updatedAt = Instant.now();
  }
}
