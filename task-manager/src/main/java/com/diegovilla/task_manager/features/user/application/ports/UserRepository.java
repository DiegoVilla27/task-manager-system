package com.diegovilla.task_manager.features.user.application.ports;

import com.diegovilla.task_manager.features.user.domain.model.UserModel;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {

  boolean existsByEmailIgnoreCase(String email);

  List<UserModel> getAll();

  Optional<UserModel> getById(UUID id);

  UserModel save(UserModel userModel);

  void delete(UUID id);
}
