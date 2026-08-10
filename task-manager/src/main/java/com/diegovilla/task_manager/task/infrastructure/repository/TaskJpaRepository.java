package com.diegovilla.task_manager.task.infrastructure.repository;

import com.diegovilla.task_manager.task.infrastructure.entities.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository providing database access for
 * {@link TaskEntity} instances.
 *
 * <p>This interface is not used directly by the application layer;
 * instead, it is wrapped by {@code TaskRepositoryAdapter} which
 * implements the domain-level {@code TaskRepository} port.</p>
 *
 * @since 1.0.0
 */
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
