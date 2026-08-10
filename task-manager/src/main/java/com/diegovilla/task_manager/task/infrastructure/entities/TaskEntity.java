package com.diegovilla.task_manager.task.infrastructure.entities;

import com.diegovilla.task_manager.task.domain.enums.TaskStatus;
import com.diegovilla.task_manager.user.infrastructure.entities.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * JPA entity representing a task persisted in the {@code tasks} table.
 *
 * <p>This class is an infrastructure concern and should not be used
 * directly by the domain or application layers. Conversion to and
 * from the domain model {@link com.diegovilla.task_manager.task.domain.models.TaskModel}
 * is handled by {@link com.diegovilla.task_manager.task.infrastructure.mappers.TaskEntityMapper}.</p>
 *
 * @since 1.0.0
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(
  name = "tasks",
  uniqueConstraints = {
    @UniqueConstraint(
      name = "uk_tasks_title",
      columnNames = "title"
    )
  })
public class TaskEntity {
  @Id
  private UUID id;

  @Column(nullable = false, length = 100)
  private String title;

  @Column(nullable = false, length = 400)
  private String description;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private TaskStatus status;

  // ManyToOne: Relacion Muchos a uno (Muchas Task -> Uno User)
  // fetch: lazy es para que no traiga los datos de user si no se le piden explicitemente
  // optional: false es para que no se pueda crear una task con user null (APP)
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  // JoinColumn: Indica que esta entidad es la dueña y contendrá la foreign key
  // name: nombre de la columna que contendrá la foreign key
  // nullable: indica que esta columna no puede ser null (DB)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;
}
