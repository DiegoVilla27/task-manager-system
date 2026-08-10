package com.diegovilla.task_manager.features.task.infrastructure.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.diegovilla.task_manager.features.task.infrastructure.entity.TaskEntity;

@Repository
public interface TaskJpaRepository extends JpaRepository<TaskEntity, UUID> {

  /**
   * Checks whether a task with the given title already exists,
   * performing a case-insensitive comparison.
   *
   * @param title the title to search for.
   * @return {@code true} if a matching task exists; {@code false} otherwise.
   */
  boolean existsByTitleIgnoreCase(String title);

  @Query("""
      SELECT t
      FROM TaskEntity t
      JOIN FETCH t.user
      WHERE t.id = :id
      """)
  Optional<TaskEntity> getByIdWithUser(UUID id);

  /**
   * Retrieves all tasks with their associated user information.
   *
   * @return a list of all {@link TaskEntity} instances with fetched user data.
   */
  @Query("""
          SELECT t
          FROM TaskEntity t
          JOIN FETCH t.user
      """)
  List<TaskEntity> getAllWithUser();
}
