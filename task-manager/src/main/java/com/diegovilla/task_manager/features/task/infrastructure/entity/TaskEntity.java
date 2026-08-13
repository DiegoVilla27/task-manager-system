package com.diegovilla.task_manager.features.task.infrastructure.entity;

import java.time.Instant;
import java.util.UUID;

import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;
import com.diegovilla.task_manager.features.user.infrastructure.entity.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPA entity representing the {@code tasks} database table.
 *
 * <p>Maps database columns to Java data types and maintains foreign key relationship
 * to {@link UserEntity}. Features a unique constraint on the task title.</p>
 *
 * @since 1.0.0
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tasks", uniqueConstraints = {
    @UniqueConstraint(name = "uk_tasks_title", columnNames = "title")
})
public class TaskEntity {
  /** Unique primary key identifier. */
  @Id
  private UUID id;

  /** Task title string (unique, mandatory, up to 100 characters). */
  @Column(nullable = false, length = 100)
  private String title;

  /** Detailed task description (mandatory, up to 400 characters). */
  @Column(nullable = false, length = 400)
  private String description;

  /** Task lifecycle status enum value. */
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private TaskStatus status;

  /** Many-to-One relationship to the owning user entity. */
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  /** Timestamp when the task record was created. */
  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  /** Timestamp when the task record was last updated. */
  @Column(nullable = false)
  private Instant updatedAt;
}
