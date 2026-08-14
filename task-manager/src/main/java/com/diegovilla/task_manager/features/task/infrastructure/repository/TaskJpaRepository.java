package com.diegovilla.task_manager.features.task.infrastructure.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.diegovilla.task_manager.features.task.infrastructure.entity.TaskEntity;

/**
 * Spring Data JPA repository for {@link TaskEntity}.
 *
 * <p>Provides standard CRUD operations, dynamic JPA specification execution,
 * and custom JPQL queries with fetch joins.</p>
 *
 * @since 1.0.0
 */
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

  /**
   * Retrieves a single task entity by ID along with its associated user using a JPQL fetch join.
   *
   * @param id unique identifier of the task.
   * @return an {@link Optional} containing the task entity if found.
   */
  @Query("""
    SELECT t FROM TaskEntity t
    JOIN FETCH t.user
    WHERE t.id = :id
    """)
  Optional<TaskEntity> findByIdWithUser(@Param("id") UUID id);

  /**
   * Bulk-deletes all tasks associated with a given user ID.
   *
   * @param userId unique identifier (UUID) of the owning user.
   */
  @Modifying
  @Query(
    """
    DELETE FROM TaskEntity t
    WHERE t.user.id = :userId
    """
  )
  void deleteAllByUserId(@Param("userId") UUID userId);
}

