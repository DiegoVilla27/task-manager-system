package com.diegovilla.task_manager.user.infrastructure.entities;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.diegovilla.task_manager.task.infrastructure.entities.TaskEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(
  name = "users",
  uniqueConstraints = {
    @UniqueConstraint(
      name = "uk_users_email",
      columnNames = "email"
    )
  })
public class UserEntity {

  @Id
  private UUID id;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(nullable = false, length = 100)
  private String lastname;

  @Column(nullable = false, length = 150)
  private String email;

  @Column(nullable = false)
  private String password;

  // OneToMany: Relacion uno a muchos (Un User -> Muchas Task)
  // mappedBy: "user" la relacion ya está mapea y gestionada con user de TaskEntity
  // fetch: lazy es para que no traiga la lista de tasks si no se le piden explicitamente
  @OneToMany(
    mappedBy = "user",
    fetch = FetchType.LAZY
  )
  private List<TaskEntity> tasks = new ArrayList<>();

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;
}
