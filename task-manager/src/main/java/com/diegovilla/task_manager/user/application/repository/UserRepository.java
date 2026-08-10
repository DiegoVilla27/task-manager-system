package com.diegovilla.task_manager.user.application.repository;

import com.diegovilla.task_manager.user.domain.models.UserModel;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository {

  boolean existsByEmailIgnoreCase(String email);

  List<UserModel> getAll();

  Optional<UserModel> getById(UUID id);

  UserModel save(UserModel userModel);

  void delete(UUID id);
}
