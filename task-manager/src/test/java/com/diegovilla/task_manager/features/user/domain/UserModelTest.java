package com.diegovilla.task_manager.features.user.domain;

import com.diegovilla.task_manager.core.errors.exceptions.DomainException;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class UserModelTest {

  @Test
  @DisplayName("Should create a user successfully with valid name, lastname, email and password")
  void shouldCreateUserSuccessfully() {
    UserModel user = UserModel.create(
      "John",
      "Doe",
      "john.doe@example.com",
      "12345678"
    );

    assertThat(user).isNotNull();
  }

  @ParameterizedTest
  @NullAndEmptySource
  @ValueSource(strings = {"   "})
  @DisplayName("Should reject creating a user if name is null or blank")
  void shouldRejectCreateUserIfNameNullOrBlank(String name) {
    assertThatThrownBy(() -> UserModel.create(
      name,
      "Doe",
      "john.doe@example.com",
      "12345678"
    )).isInstanceOf(DomainException.class)
      .hasMessage("Name is required");
  }

  @Test
  @DisplayName("Should reject creating a user if name has less than 3 characters")
  void shouldRejectCreateUserIfNameLessThreeCharacters() {
    assertThatThrownBy(() -> UserModel.create(
      "Jo",
      "Doe",
      "john.doe@example.com",
      "12345678"
    )).isInstanceOf(DomainException.class)
      .hasMessage("Name must be between 3 and 100 characters");
  }

  @Test
  @DisplayName("Should reject creating a user if name has more than 100 characters")
  void shouldRejectCreateUserIfNameMoreThanOneHundredCharacters() {
    assertThatThrownBy(() -> UserModel.create(
      "J".repeat(101),
      "Doe",
      "john.doe@example.com",
      "12345678"
    )).isInstanceOf(DomainException.class)
      .hasMessage("Name must be between 3 and 100 characters");
  }

  @Test
  @DisplayName("Should reject creating a user if email is invalid")
  void shouldRejectCreateUserIfEmailInvalid() {
    assertThatThrownBy(() -> UserModel.create(
      "John",
      "Doe",
      "invalid-email",
      "12345678"
    )).isInstanceOf(DomainException.class)
      .hasMessage("Email has an invalid format");
  }

  @Test
  @DisplayName("Should reconstruct a user successfully")
  void shouldReconstructUser() {
    UserModel user = UserModel.create(
      "John",
      "Doe",
      "john.doe@example.com",
      "12345678"
    );

    UserModel userReconstruct = UserModel.reconstruct(
      user.getId(),
      user.getName(),
      user.getLastname(),
      user.getEmail(),
      user.getPassword(),
      user.getRole(),
      user.getCreatedAt(),
      user.getUpdatedAt()
    );

    assertThat(userReconstruct).usingRecursiveComparison().isEqualTo(user);
  }

  @Test
  @DisplayName("Should update user information successfully")
  void shouldUpdateInformation() {
    UserModel user = UserModel.create(
      "John",
      "Doe",
      "john.doe@example.com",
      "12345678"
    );

    user.updateInformation(
      "Jane",
      "Smith",
      "jane.smith@example.com"
    );

    assertThat(user.getName()).isEqualTo("Jane");
  }

  @Test
  @DisplayName("Should update user information only lastname successfully")
  void shouldUpdateInformationOnlyLastname() {
    UserModel user = UserModel.create(
      "John",
      "Doe",
      "john.doe@example.com",
      "12345678"
    );

    user.updateInformation(
      null,
      "Smith",
      null
    );

    assertThat(user.getName()).isEqualTo("John");
    assertThat(user.getLastname()).isEqualTo("Smith");
  }
}
