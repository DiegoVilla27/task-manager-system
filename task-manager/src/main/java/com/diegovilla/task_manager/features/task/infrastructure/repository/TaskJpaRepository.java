package com.diegovilla.task_manager.features.task.infrastructure.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.diegovilla.task_manager.features.task.infrastructure.entity.TaskEntity;

@Repository
public interface TaskJpaRepository extends JpaRepository<TaskEntity, UUID>, JpaSpecificationExecutor<TaskEntity> {

  /**
   * Checks whether a task with the given title already exists,
   * performing a case-insensitive comparison.
   *
   * @param title the title to search for.
   * @return {@code true} if a matching task exists; {@code false} otherwise.
   */
  boolean existsByTitleIgnoreCase(String title);

  @Query("""
    SELECT t FROM TaskEntity t
    JOIN FETCH t.user
    WHERE t.id = :id
    """)
  Optional<TaskEntity> findByIdWithUser(@Param("id") UUID id);
}
