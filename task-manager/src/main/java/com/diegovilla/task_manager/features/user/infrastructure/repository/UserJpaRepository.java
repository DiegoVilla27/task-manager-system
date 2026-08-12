package com.diegovilla.task_manager.features.user.infrastructure.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.diegovilla.task_manager.features.user.infrastructure.entity.UserEntity;

@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, UUID>, JpaSpecificationExecutor<UserEntity> {
  boolean existsByEmailIgnoreCase(String email);

  @Query(
    """
    SELECT u FROM UserEntity u
    WHERE :email = u.email
    """
  )
  Optional<UserEntity> findByEmail(@Param("email") String email);
}
