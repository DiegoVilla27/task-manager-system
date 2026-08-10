package com.diegovilla.task_manager.features.task.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

import com.diegovilla.task_manager.core.errors.exceptions.DomainException;
import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.utils.data.StringUtils;
import com.diegovilla.task_manager.utils.data.ValidateDataUtils;

import lombok.Getter;

@Getter
public class TaskModel {
  private final UUID id;
  private String title;
  private String description;
  private TaskStatus status;
  private final UserModel user;
  private final Instant createdAt;
  private Instant updatedAt;

  /**
   * Internal constructor — use the factory methods instead.
   */
  private TaskModel(
      UUID id,
      String title,
      String description,
      TaskStatus status,
      UserModel user,
      Instant createdAt,
      Instant updatedAt) {
    this.id = Objects.requireNonNull(id, "Task ID cannot be null");
    this.title = Objects.requireNonNull(title, "Task title cannot be null").trim();
    this.description = Objects.requireNonNull(description, "Task description cannot be null").trim();
    this.status = Objects.requireNonNull(status, "Task status cannot be null");
    this.user = Objects.requireNonNull(user, "Task user cannot be null");
    this.createdAt = Objects.requireNonNull(createdAt, "Task createdAt cannot be null");
    this.updatedAt = Objects.requireNonNull(updatedAt, "Task updatedAt cannot be null");
  }

  /**
   * Factory method to create a brand-new task in {@code PENDING} status.
   *
   * <p>
   * Validates that both {@code title} and {@code description} are
   * present and within the allowed length range.
   * </p>
   *
   * @param title       task title (3–100 characters).
   * @param description task description (3–400 characters).
   * @param user        the user who owns the task.
   * @return a new {@link TaskModel} with a generated UUID and current timestamps.
   * @throws DomainException if title or description is invalid.
   */
  public static TaskModel create(String title, String description, UserModel user) {
    title = ValidateDataUtils.required(title, 3, 100, "Title");
    description = ValidateDataUtils.required(description, 3, 400, "Description");

    return new TaskModel(
        UUID.randomUUID(),
        title,
        description,
        TaskStatus.PENDING,
        user,
        Instant.now(),
        Instant.now());
  }

  /**
   * Reconstructs a {@link TaskModel} from persisted data without
   * re-validating business rules.
   *
   * @param id          unique identifier.
   * @param title       task title.
   * @param description task description.
   * @param status      current lifecycle status.
   * @param user        the user who owns the task.
   * @param createdAt   creation timestamp.
   * @param updatedAt   last-update timestamp.
   * @return a fully hydrated domain model.
   * @throws NullPointerException if any argument is {@code null}.
   */
  public static TaskModel reconstruct(
      UUID id,
      String title,
      String description,
      TaskStatus status,
      UserModel user,
      Instant createdAt,
      Instant updatedAt) {
    return new TaskModel(
        Objects.requireNonNull(id, "Task ID cannot be null"),
        Objects.requireNonNull(title, "Task title cannot be null"),
        Objects.requireNonNull(description, "Task description cannot be null"),
        Objects.requireNonNull(status, "Task status cannot be null"),
        Objects.requireNonNull(user, "Task user cannot be null"),
        Objects.requireNonNull(createdAt, "Task createdAt cannot be null"),
        Objects.requireNonNull(updatedAt, "Task updatedAt cannot be null"));
  }

  /**
   * Transitions the task to {@code IN_PROGRESS}.
   *
   * @throws DomainException if the task is already in progress or completed.
   */
  public void start() {
    if (this.status == TaskStatus.IN_PROGRESS || this.status == TaskStatus.COMPLETED) {
      throw new DomainException("Task is already in progress or completed");
    }

    this.status = TaskStatus.IN_PROGRESS;
    this.updatedAt = Instant.now();
  }

  /**
   * Transitions the task to {@code COMPLETED}.
   *
   * @throws DomainException if the task has not been started or is already
   *                         completed.
   */
  public void complete() {
    if (this.status == TaskStatus.PENDING || this.status == TaskStatus.COMPLETED) {
      throw new DomainException("Task is not started yet or already completed");
    }

    this.status = TaskStatus.COMPLETED;
    this.updatedAt = Instant.now();
  }

  /**
   * Updates the task's title and/or description.
   *
   * <p>
   * Only non-{@code null}, non-blank values are applied. Completed
   * tasks cannot be modified.
   * </p>
   *
   * @param title       new title, or {@code null} to keep current.
   * @param description new description, or {@code null} to keep current.
   * @throws DomainException if the task is already completed.
   */
  public void updateInformation(String title, String description) {
    if (this.status == TaskStatus.COMPLETED) {
      throw new DomainException("Task is already completed");
    }

    this.title = ValidateDataUtils.updateIfPresent(title, this.title, 3, 100, "Title");
    this.description = ValidateDataUtils.updateIfPresent(description, this.description, 3, 400, "Description");
    this.updatedAt = Instant.now();
  }

  /**
   * Returns a normalized (trimmed and lowered) version of the title
   * suitable for uniqueness checks.
   *
   * @return the normalized title.
   */
  public String normalizedTitle() {
    return StringUtils.normalize(this.title);
  }
}
