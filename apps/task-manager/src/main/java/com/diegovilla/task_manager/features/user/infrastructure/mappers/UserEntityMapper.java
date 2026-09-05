package com.diegovilla.task_manager.features.user.infrastructure.mappers;

import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.infrastructure.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper converting between {@link UserEntity} persistence entities and {@link UserModel}
 * domain models.
 *
 * @since 1.0.0
 */
@Mapper(componentModel = "spring")
public interface UserEntityMapper {

    /**
     * Converts a persistence entity into a domain aggregate model.
     *
     * @param userEntity persistence entity to convert.
     * @return a reconstructed {@link UserModel}, or {@code null} if input is null.
     */
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

    /**
     * Converts a domain aggregate model into a JPA persistence entity.
     *
     * @param userModel domain model to convert.
     * @return a JPA {@link UserEntity} ready for persistence.
     */
    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "taskCount", ignore = true)
    UserEntity modelToEntity(UserModel userModel);
}
