package com.diegovilla.task_manager.features.user.infrastructure.repository;

import com.diegovilla.task_manager.features.user.infrastructure.entity.UserEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for {@link UserEntity}.
 *
 * <p>Provides standard CRUD operations, dynamic JPA specification execution, and custom queries for
 * email-based lookup.
 *
 * @since 1.0.0
 */
@Repository
public interface UserJpaRepository
        extends JpaRepository<UserEntity, UUID>, JpaSpecificationExecutor<UserEntity> {

    /**
     * Checks whether a user with the specified email exists, ignoring case.
     *
     * @param email email string to search for.
     * @return {@code true} if an entity with matching email is found; {@code false} otherwise.
     */
    boolean existsByEmailIgnoreCase(String email);

    /**
     * Finds a user entity by exact email address match.
     *
     * @param email email string to search for.
     * @return an {@link Optional} containing {@link UserEntity} if found.
     */
    @Query(
            """
    SELECT u FROM UserEntity u
    WHERE :email = u.email
    """)
    Optional<UserEntity> findByEmail(@Param("email") String email);
}
