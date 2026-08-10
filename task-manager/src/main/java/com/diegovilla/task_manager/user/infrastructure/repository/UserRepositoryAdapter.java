package com.diegovilla.task_manager.user.infrastructure.repository;

import com.diegovilla.task_manager.core.errors.translators.DatabaseExceptionTranslator;
import com.diegovilla.task_manager.user.application.repository.UserRepository;
import com.diegovilla.task_manager.user.domain.models.UserModel;
import com.diegovilla.task_manager.user.infrastructure.entities.UserEntity;
import com.diegovilla.task_manager.user.infrastructure.mappers.UserEntityMapper;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@AllArgsConstructor
public class UserRepositoryAdapter implements UserRepository {

  private UserJpaRepository userJpaRepository;
  private DatabaseExceptionTranslator databaseExceptionTranslator;
  private UserEntityMapper userEntityMapper;

  @Override
  public boolean existsByEmailIgnoreCase(String email) {
    return userJpaRepository.existsByEmailIgnoreCase(email);
  }

  @Override
  public List<UserModel> getAll() {
    return userJpaRepository.findAll().stream().map(userEntityMapper::entityToModel).toList();
  }

  @Override
  public Optional<UserModel> getById(UUID id) {
    return userJpaRepository.findById(id).map(userEntityMapper::entityToModel);
  }

  @Override
  public UserModel save(UserModel user) {
    try {
      UserEntity userNew = userEntityMapper.modelToEntity(user);
      UserEntity userSaved = userJpaRepository.saveAndFlush(userNew);

      return userEntityMapper.entityToModel(userSaved);
    } catch (DataIntegrityViolationException ex) {
      throw databaseExceptionTranslator.translate(ex);
    }
  }

  @Override
  public void delete(UUID id) {
    try {
      userJpaRepository.deleteById(id);
    } catch (DataIntegrityViolationException ex) {
      throw databaseExceptionTranslator.translate(ex);
    }
  }
}
