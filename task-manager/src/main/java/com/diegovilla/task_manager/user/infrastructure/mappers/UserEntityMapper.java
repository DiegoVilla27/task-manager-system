package com.diegovilla.task_manager.user.infrastructure.mappers;

import com.diegovilla.task_manager.user.domain.models.UserModel;
import com.diegovilla.task_manager.user.infrastructure.entities.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

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
      userEntity.getCreatedAt(),
      userEntity.getUpdatedAt()
    );
  }

  UserEntity modelToEntity(UserModel userModel);
}
