package com.diegovilla.task_manager.user.infrastructure.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.diegovilla.task_manager.user.infrastructure.entities.UserEntity;

@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, UUID> {
  boolean existsByEmailIgnoreCase(String email);
}
