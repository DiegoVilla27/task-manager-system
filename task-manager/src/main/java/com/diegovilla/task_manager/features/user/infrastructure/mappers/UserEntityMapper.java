package com.diegovilla.task_manager.features.user.infrastructure.mappers;

import org.mapstruct.Mapper;

import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.infrastructure.entity.UserEntity;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserEntityMapper {

  default UserModel entityToModel(UserEntity userEntity) {
    if (userEntity == null) {
      return null;
    }

    return UserModel.reconstruct(
        userEntity.getId(),
        userEntity.getName(),
        userEntity.getLastname(),
        userEntity.getEmail(),
        userEntity.getPassword(),
        userEntity.getRole(),
        userEntity.getCreatedAt(),
        userEntity.getUpdatedAt());
  }

  @Mapping(target = "tasks", ignore = true)
  UserEntity modelToEntity(UserModel userModel);
}
