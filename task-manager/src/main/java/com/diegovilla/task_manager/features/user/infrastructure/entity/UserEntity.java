package com.diegovilla.task_manager.features.user.infrastructure.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.diegovilla.task_manager.features.task.infrastructure.entity.TaskEntity;
import com.diegovilla.task_manager.features.user.domain.valueobjects.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Formula;

/**
 * JPA entity representing the {@code users} database table.
 *
 * <p>Persists user credentials, roles, and timestamps. Maintains a one-to-many relationship
 * with {@link TaskEntity} and calculates total assigned task count via a Hibernate formula subquery.</p>
 *
 * @since 1.0.0
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints = {
  @UniqueConstraint(name = "uk_users_email", columnNames = "email")
})
public class UserEntity {

  /** Unique primary key identifier. */
  @Id
  private UUID id;

  /** User first name (up to 100 characters). */
  @Column(nullable = false, length = 100)
  private String name;

  /** User last name (up to 100 characters). */
  @Column(nullable = false, length = 100)
  private String lastname;

  /** Unique email address (up to 150 characters). */
  @Column(nullable = false, length = 150)
  private String email;

  /** Securely hashed password. */
  @Column(nullable = false)
  private String password;

  /** Authorization role of the user. */
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private UserRole role;

  /** Collection of tasks assigned to this user. */
  @Builder.Default
  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  private List<TaskEntity> tasks = new ArrayList<>();

  /** Total count of tasks owned by this user computed dynamically by the database. */
  @Formula("(SELECT COUNT(t.id) FROM tasks t WHERE t.user_id = id)")
  private Long taskCount;

  /** Timestamp when the record was created. */
  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  /** Timestamp when the record was last updated. */
  @Column(nullable = false)
  private Instant updatedAt;

  /**
   * Returns the count of tasks, defaulting to 0 if null.
   *
   * @return the total number of tasks.
   */
  public Long getTaskCount() {
    return taskCount == null ? 0L : taskCount;
  }
}

