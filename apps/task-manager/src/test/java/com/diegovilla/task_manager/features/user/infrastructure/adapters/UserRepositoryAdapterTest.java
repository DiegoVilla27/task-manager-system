package com.diegovilla.task_manager.features.user.infrastructure.adapters;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.diegovilla.task_manager.core.errors.exceptions.DomainException;
import com.diegovilla.task_manager.core.errors.translators.DatabaseExceptionTranslator;
import com.diegovilla.task_manager.features.user.application.commands.UserFiltersCommand;
import com.diegovilla.task_manager.features.user.application.dto.response.UserWithTaskCount;
import com.diegovilla.task_manager.features.user.domain.model.UserModel;
import com.diegovilla.task_manager.features.user.domain.valueobjects.UserRole;
import com.diegovilla.task_manager.features.user.infrastructure.entity.UserEntity;
import com.diegovilla.task_manager.features.user.infrastructure.mappers.UserEntityMapper;
import com.diegovilla.task_manager.features.user.infrastructure.repository.UserJpaRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@ExtendWith(MockitoExtension.class)
class UserRepositoryAdapterTest {

    @Mock private UserJpaRepository userJpaRepository;
    @Mock private DatabaseExceptionTranslator databaseExceptionTranslator;
    @Mock private UserEntityMapper userEntityMapper;

    @InjectMocks private UserRepositoryAdapter userRepositoryAdapter;

    private UUID userId;
    private UserEntity userEntity;
    private UserModel userModel;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        userEntity =
                UserEntity.builder()
                        .id(userId)
                        .name("John")
                        .lastname("Doe")
                        .email("john@example.com")
                        .password("hashed_pass")
                        .role(UserRole.USER)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .taskCount(2L)
                        .build();

        userModel =
                UserModel.reconstruct(
                        userId,
                        "John",
                        "Doe",
                        "john@example.com",
                        "hashed_pass",
                        UserRole.USER,
                        Instant.now(),
                        Instant.now());
    }

    @Test
    @DisplayName("Should check if user exists by email ignore case")
    void shouldCheckExistsByEmailIgnoreCase() {
        when(userJpaRepository.existsByEmailIgnoreCase("john@example.com")).thenReturn(true);
        when(userJpaRepository.existsByEmailIgnoreCase("unknown@example.com")).thenReturn(false);

        assertThat(userRepositoryAdapter.existsByEmailIgnoreCase("john@example.com")).isTrue();
        assertThat(userRepositoryAdapter.existsByEmailIgnoreCase("unknown@example.com")).isFalse();
    }

    @Test
    @DisplayName("Should get all users paginated with filters")
    @SuppressWarnings("unchecked")
    void shouldGetAllUsersWithFilters() {
        Pageable pageable = PageRequest.of(0, 10);
        UserFiltersCommand filters = new UserFiltersCommand("John", userId);
        Page<UserEntity> page = new PageImpl<>(List.of(userEntity));

        when(userJpaRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(userEntityMapper.entityToModel(userEntity)).thenReturn(userModel);

        Page<UserWithTaskCount> result = userRepositoryAdapter.getAll(pageable, filters);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).user().getName()).isEqualTo("John");
        assertThat(result.getContent().get(0).countTasks()).isEqualTo(2L);
    }

    @Test
    @DisplayName("Should get user by id when exists")
    void shouldGetUserByIdWhenExists() {
        when(userJpaRepository.findById(userId)).thenReturn(Optional.of(userEntity));
        when(userEntityMapper.entityToModel(userEntity)).thenReturn(userModel);

        Optional<UserWithTaskCount> result = userRepositoryAdapter.getById(userId);

        assertThat(result).isPresent();
        assertThat(result.get().user().getId()).isEqualTo(userId);
    }

    @Test
    @DisplayName("Should return empty optional when user by id not found")
    void shouldReturnEmptyWhenUserByIdNotFound() {
        when(userJpaRepository.findById(userId)).thenReturn(Optional.empty());

        Optional<UserWithTaskCount> result = userRepositoryAdapter.getById(userId);

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Should get user by email when exists")
    void shouldGetUserByEmailWhenExists() {
        when(userJpaRepository.findByEmail("john@example.com")).thenReturn(Optional.of(userEntity));
        when(userEntityMapper.entityToModel(userEntity)).thenReturn(userModel);

        Optional<UserModel> result = userRepositoryAdapter.getByEmail("john@example.com");

        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("john@example.com");
    }

    @Test
    @DisplayName("Should save user successfully")
    void shouldSaveUserSuccessfully() {
        when(userEntityMapper.modelToEntity(userModel)).thenReturn(userEntity);
        when(userJpaRepository.saveAndFlush(userEntity)).thenReturn(userEntity);
        when(userEntityMapper.entityToModel(userEntity)).thenReturn(userModel);

        UserModel result = userRepositoryAdapter.save(userModel);

        assertThat(result).isEqualTo(userModel);
    }

    @Test
    @DisplayName("Should translate exception on save when DataIntegrityViolationException occurs")
    void shouldTranslateExceptionOnSave() {
        when(userEntityMapper.modelToEntity(userModel)).thenReturn(userEntity);
        when(userJpaRepository.saveAndFlush(userEntity))
                .thenThrow(new DataIntegrityViolationException("duplicate key"));
        when(databaseExceptionTranslator.translate(any(DataIntegrityViolationException.class)))
                .thenReturn(new DomainException("Translated DB Error"));

        assertThatThrownBy(() -> userRepositoryAdapter.save(userModel))
                .isInstanceOf(DomainException.class)
                .hasMessage("Translated DB Error");
    }

    @Test
    @DisplayName("Should delete user by id successfully")
    void shouldDeleteUserSuccessfully() {
        userRepositoryAdapter.delete(userId);

        verify(userJpaRepository).deleteById(userId);
        verify(userJpaRepository).flush();
    }

    @Test
    @DisplayName("Should translate exception on delete when DataIntegrityViolationException occurs")
    void shouldTranslateExceptionOnDelete() {
        doThrow(new DataIntegrityViolationException("foreign key"))
                .when(userJpaRepository)
                .deleteById(userId);
        when(databaseExceptionTranslator.translate(any(DataIntegrityViolationException.class)))
                .thenReturn(new DomainException("Translated FK Error"));

        assertThatThrownBy(() -> userRepositoryAdapter.delete(userId))
                .isInstanceOf(DomainException.class)
                .hasMessage("Translated FK Error");
    }
}
