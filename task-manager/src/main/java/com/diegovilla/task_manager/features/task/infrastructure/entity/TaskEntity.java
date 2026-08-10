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
  // fetch: lazy es para que no traiga los datos de user si no se le piden
  // explicitemente
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
