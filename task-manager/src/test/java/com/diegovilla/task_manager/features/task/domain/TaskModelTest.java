package com.diegovilla.task_manager.features.task.domain;

import com.diegovilla.task_manager.core.errors.exceptions.DomainException;
import com.diegovilla.task_manager.features.task.domain.model.TaskModel;
import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;

import java.time.Instant;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class TaskModelTest {

  private final UUID userId = UUID.randomUUID();

  @Test
  @DisplayName("Should create a task successfully with valid title and description")
  void shouldCreateTaskSuccessfully() {
    TaskModel task = TaskModel.create(
      "Tarea 1",
      "Mi Tarea 1",
      userId
    );

    assertThat(task).isNotNull();
    assertThat(task.getTitle()).isEqualTo("Tarea 1");
    assertThat(task.getDescription()).isEqualTo("Mi Tarea 1");
  }

  @ParameterizedTest
  @NullAndEmptySource
  @ValueSource(strings = {"   "})
  @DisplayName("Should reject creating a task if title or description is null or blank")
  void shouldRejectCreateTaskIfTitleNullOrBlank(String title) {
    assertThatThrownBy(() -> TaskModel.create(title, "Mi Tarea 1", userId))
      .isInstanceOf(DomainException.class)
      .hasMessage("Title is required");
  }

  @ParameterizedTest
  @NullAndEmptySource
  @ValueSource(strings = {"   "})
  @DisplayName("Should reject creating a task if title or description is null or blank")
  void shouldRejectCreateTaskIfDescriptionNullOrBlank(String description) {
    assertThatThrownBy(() -> TaskModel.create("Tarea 1", description, userId))
      .isInstanceOf(DomainException.class)
      .hasMessage("Description is required");
  }

  @ParameterizedTest
  @MethodSource("provideBoundaryLengthCases")
  @DisplayName("Should reject creating a task if title or description haven't correct length")
  void shouldRejectCreateTaskIfTitleOrDescriptionHaventCorrectLength(String fieldName, String text) {
    if (fieldName.equals("Title")) {
      assertThatThrownBy(() -> TaskModel.create(text, "Mi Tarea 1", userId))
        .isInstanceOf(DomainException.class)
        .hasMessage("Title must be between 3 and 100 characters");
    } else {
      assertThatThrownBy(() -> TaskModel.create("Tarea 1", text, userId))
        .isInstanceOf(DomainException.class)
        .hasMessage("Description must be between 3 and 400 characters");
    }
  }

  @Test
  @DisplayName("Should reconstruct a task successfully")
  void shouldReconstructTask() {
    TaskModel task = TaskModel.create("Tarea 1", "Mi Tarea 1", userId);

    TaskModel taskReconstruct = TaskModel.reconstruct(
      task.getId(),
      task.getTitle(),
      task.getDescription(),
      task.getStatus(),
      task.getUserId(),
      task.getCreatedAt(),
      task.getUpdatedAt()
    );

    assertThat(taskReconstruct).usingRecursiveComparison().isEqualTo(task);
  }

  @Test
  @DisplayName("Should start a pending task")
  void shouldStartPendingTask() {
    TaskModel task = TaskModel.create("Tarea 1", "Mi Tarea 1", userId);

    task.start();

    assertThat(task.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
  }

  @ParameterizedTest
  @EnumSource(value = TaskStatus.class, names = {"IN_PROGRESS", "COMPLETED"})
  @DisplayName("Should reject starting a task if it is already in progress or completed")
  void shouldRejectStartTaskIfInProgressOrCompleted(TaskStatus taskStatus) {
    TaskModel task = TaskModel.reconstruct(
      UUID.randomUUID(),
      "Tarea 1",
      "Mi Tarea 1",
      taskStatus,
      userId,
      Instant.now(),
      Instant.now()
    );

    assertThatThrownBy(task::start)
      .isInstanceOf(DomainException.class)
      .hasMessage("Task is already in progress or completed");
  }

  @Test
  @DisplayName("Should complete an in-progress task")
  void shouldCompleteInProgressTask() {
    TaskModel task = TaskModel.create("Tarea 1", "Mi Tarea 1", userId);

    task.start();
    task.complete();

    assertThat(task.getStatus()).isEqualTo(TaskStatus.COMPLETED);
  }

  @ParameterizedTest
  @EnumSource(value = TaskStatus.class, names = {"PENDING", "COMPLETED"})
  @DisplayName("Should reject completing a task if it is pending or already completed")
  void shouldRejectCompleteTaskIfPendingOrCompleted(TaskStatus taskStatus) {

    TaskModel task = TaskModel.reconstruct(
      UUID.randomUUID(),
      "Tarea 1",
      "Mi Tarea 1",
      taskStatus,
      userId,
      Instant.now(),
      Instant.now()
    );

    assertThatThrownBy(task::complete)
      .isInstanceOf(DomainException.class)
      .hasMessage("Task is not started yet or already completed");
  }

  @Test
  @DisplayName("Should update task information successfully")
  void shouldUpdateInformation() {
    TaskModel task = TaskModel.create("Tarea 1", "Mi Tarea 1", userId);

    task.updateInformation("Tarea 1 Actualizada", "Mi Tarea 1 Actualizada");

    assertThat(task.getTitle()).isEqualTo("Tarea 1 Actualizada");
    assertThat(task.getDescription()).isEqualTo("Mi Tarea 1 Actualizada");
  }

  @Test
  @DisplayName("Should reject updating information of a completed task")
  void shouldRejectUpdateInformation() {
    TaskModel task = TaskModel.create("Tarea 1", "Mi Tarea 1", userId);
    task.start();
    task.complete();

    assertThatThrownBy(() ->
      task.updateInformation("Tarea 1 Actualizada", "Mi Tarea 1 Actualizada")
    ).isInstanceOf(DomainException.class)
      .hasMessage("Task is already completed");
  }

  @Test
  @DisplayName("Should return normalized title")
  void shouldReturnNormalizedTitle() {
    TaskModel task = TaskModel.create("   Tarea 1   ", "Mi Tarea 1", userId);
    String titleNormalized = task.normalizedTitle();

    assertThat(titleNormalized).isEqualTo("tarea 1");
  }

  /**
   * Provides test cases for validating required text fields against
   * {@code null}, empty, and blank values.
   *
   * <p>Each {@link Arguments} contains:</p>
   * <ul>
   *   <li>The name of the field being tested.</li>
   *   <li>The invalid value to be supplied.</li>
   * </ul>
   *
   * <p>Use this provider with JUnit 5's
   * {@link org.junit.jupiter.params.ParameterizedTest}
   * and {@link org.junit.jupiter.params.provider.MethodSource}:</p>
   *
   * <pre>{@code
   * @ParameterizedTest
   * @MethodSource("provideNullOrBlankCases")
   * void shouldRejectInvalidValues(String fieldName, String value) {
   *   if (fieldName.equals("Title")) {
   *     assertThatThrownBy(() -> TaskModel.create(value, "Description"))
   *       .isInstanceOf(DomainException.class);
   *   } else {
   *     assertThatThrownBy(() -> TaskModel.create("Title", value))
   *       .isInstanceOf(DomainException.class);
   *   }
   * }
   * }</pre>
   *
   * <p>The provider generates the following scenarios:</p>
   * <ul>
   *   <li>{@code Title}: {@code null}, empty, and blank values.</li>
   *   <li>{@code Description}: {@code null}, empty, and blank values.</li>
   * </ul>
   *
   * @return a stream of {@link Arguments} representing invalid null or blank values.
   */
  private static Stream<Arguments> provideNullOrBlankCases() {
    return Stream.of(
      // Title: null, empty, and blank
      Arguments.of("Title", null),
      Arguments.of("Title", ""),
      Arguments.of("Title", "   "),

      // Description: null, empty, and blank
      Arguments.of("Description", null),
      Arguments.of("Description", ""),
      Arguments.of("Description", "   ")
    );
  }

  /**
   * Provides test cases for validating text fields against their
   * minimum and maximum allowed lengths.
   *
   * <p>Each {@link Arguments} contains:</p>
   * <ul>
   *   <li>The name of the field being tested.</li>
   *   <li>An invalid value whose length is outside the allowed range.</li>
   * </ul>
   *
   * <p>Use this provider with JUnit 5's
   * {@link org.junit.jupiter.params.ParameterizedTest}
   * and {@link org.junit.jupiter.params.provider.MethodSource}:</p>
   *
   * <pre>{@code
   * @ParameterizedTest
   * @MethodSource("provideBoundaryLengthCases")
   * void shouldRejectInvalidLengths(String fieldName, String value) {
   *   if (fieldName.equals("Title")) {
   *     assertThatThrownBy(() -> TaskModel.create(value, "Description"))
   *       .isInstanceOf(DomainException.class);
   *   } else {
   *     assertThatThrownBy(() -> TaskModel.create("Title", value))
   *       .isInstanceOf(DomainException.class);
   *   }
   * }
   * }</pre>
   *
   * <p>The generated values intentionally test the boundaries just
   * outside the valid ranges:</p>
   *
   * <ul>
   *   <li>{@code Title}: 2 and 101 characters (valid range: 3–100).</li>
   *   <li>{@code Description}: 2 and 401 characters (valid range: 3–400).</li>
   * </ul>
   *
   * <p>This is useful for testing boundary conditions without manually
   * writing long strings.</p>
   *
   * @return a stream of {@link Arguments} representing invalid
   * boundary-length values.
   */
  private static Stream<Arguments> provideBoundaryLengthCases() {
    return Stream.of(
      // Title: valid range is 3–100 characters
      Arguments.of("Title", "a".repeat(3 - 1)),
      Arguments.of("Title", "a".repeat(100 + 1)),

      // Description: valid range is 3–400 characters
      Arguments.of("Description", "a".repeat(3 - 1)),
      Arguments.of("Description", "a".repeat(400 + 1))
    );
  }
}
