package com.diegovilla.task_manager.features.user.application.ports;

import com.diegovilla.task_manager.features.user.application.commands.UserFiltersCommand;
import com.diegovilla.task_manager.features.user.application.dto.response.UserWithTaskCount;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserFiltersDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepositoryPort {

  boolean existsByEmailIgnoreCase(String email);

  Page<UserWithTaskCount> getAll(Pageable pageable, UserFiltersCommand filters);

  Optional<UserWithTaskCount> getById(UUID id);

  Optional<UserModel> getByEmail(String email);

  UserModel save(UserModel userModel);

  void delete(UUID id);
}
