package com.diegovilla.task_manager.features.user.infrastructure.adapters;

import com.diegovilla.task_manager.core.errors.translators.DatabaseExceptionTranslator;
import com.diegovilla.task_manager.features.user.application.commands.UserFiltersCommand;
import com.diegovilla.task_manager.features.user.application.dto.response.UserWithTaskCount;
import com.diegovilla.task_manager.features.user.application.ports.UserRepositoryPort;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.infrastructure.entity.UserEntity;
import com.diegovilla.task_manager.features.user.infrastructure.mappers.UserEntityMapper;
import com.diegovilla.task_manager.features.user.infrastructure.repository.UserJpaRepository;
import com.diegovilla.task_manager.features.user.infrastructure.specifications.UserSpecifications;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

/**
 * Persistence infrastructure adapter implementing {@link UserRepositoryPort}.
 *
 * <p>Bridges user domain persistence operations to Spring Data JPA, executing query specifications,
 * mapping entities to domain models, and translating database exceptions.
 *
 * @since 1.0.0
 */
@Slf4j
@Component
@AllArgsConstructor
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final UserJpaRepository userJpaRepository;
    private final DatabaseExceptionTranslator databaseExceptionTranslator;
    private final UserEntityMapper userEntityMapper;

    /** {@inheritDoc} */
    @Override
    public boolean existsByEmailIgnoreCase(String email) {
        return userJpaRepository.existsByEmailIgnoreCase(email);
    }

    /** {@inheritDoc} */
    @Override
    public Page<UserWithTaskCount> getAll(Pageable pageable, UserFiltersCommand filters) {
        Specification<UserEntity> spec = UserSpecifications.withFilters(filters);

        return userJpaRepository
                .findAll(spec, pageable)
                .map(
                        userEntity ->
                                new UserWithTaskCount(
                                        userEntityMapper.entityToModel(userEntity),
                                        userEntity.getTaskCount()));
    }

    /** {@inheritDoc} */
    @Override
    public Optional<UserWithTaskCount> getById(UUID id) {
        return userJpaRepository
                .findById(id)
                .map(
                        userEntity ->
                                new UserWithTaskCount(
                                        userEntityMapper.entityToModel(userEntity),
                                        userEntity.getTaskCount()));
    }

    /** {@inheritDoc} */
    @Override
    public Optional<UserModel> getByEmail(String email) {
        return userJpaRepository.findByEmail(email).map(userEntityMapper::entityToModel);
    }

    /** {@inheritDoc} */
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

    /** {@inheritDoc} */
    @Override
    public void delete(UUID id) {
        try {
            userJpaRepository.deleteById(id);
            userJpaRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw databaseExceptionTranslator.translate(ex);
        }
    }
}
