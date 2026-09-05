package com.diegovilla.task_manager.features.specifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.diegovilla.task_manager.features.task.application.commands.TaskFiltersCommand;
import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;
import com.diegovilla.task_manager.features.task.infrastructure.entity.TaskEntity;
import com.diegovilla.task_manager.features.task.infrastructure.specifications.TaskSpecifications;
import com.diegovilla.task_manager.features.user.application.commands.UserFiltersCommand;
import com.diegovilla.task_manager.features.user.infrastructure.entity.UserEntity;
import com.diegovilla.task_manager.features.user.infrastructure.specifications.UserSpecifications;
import jakarta.persistence.criteria.*;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

@ExtendWith(MockitoExtension.class)
class SpecificationsTest {

    @Mock private CriteriaBuilder cb;
    @Mock private CriteriaQuery<?> query;
    @Mock private Predicate predicate;

    @Mock private Root<UserEntity> userRoot;
    @Mock private Path<Object> userPath;

    @Mock private Root<TaskEntity> taskRoot;
    @Mock private Path<Object> taskPath;

    @BeforeEach
    void setUp() {
        lenient().when(cb.conjunction()).thenReturn(predicate);
        lenient().when(cb.and(any(Predicate[].class))).thenReturn(predicate);
        lenient().when(cb.or(any(Predicate[].class))).thenReturn(predicate);
        lenient().when(cb.like(any(), anyString())).thenReturn(predicate);
        lenient().when(cb.equal(any(), any())).thenReturn(predicate);
    }

    @Test
    @DisplayName("UserSpecifications: should handle null filters")
    void testUserSpecsNullFilters() {
        Specification<UserEntity> spec = UserSpecifications.withFilters(null);
        Predicate result = spec.toPredicate(userRoot, query, cb);

        assertThat(result).isEqualTo(predicate);
        verify(cb).conjunction();
    }

    @Test
    @DisplayName("UserSpecifications: should build predicates with search and userId")
    @SuppressWarnings("unchecked")
    void testUserSpecsWithSearchAndUserId() {
        UUID userId = UUID.randomUUID();
        UserFiltersCommand filters = new UserFiltersCommand("john", userId);
        when(userRoot.get(anyString())).thenReturn(userPath);

        Specification<UserEntity> spec = UserSpecifications.withFilters(filters);
        Predicate result = spec.toPredicate(userRoot, query, cb);

        assertThat(result).isEqualTo(predicate);
        verify(cb).and(any(Predicate[].class));
    }

    @Test
    @DisplayName(
            "TaskSpecifications: should handle null filters and fetch user when not count query")
    @SuppressWarnings("unchecked")
    void testTaskSpecsNullFilters() {
        doReturn(TaskEntity.class).when(query).getResultType();

        Specification<TaskEntity> spec = TaskSpecifications.withFilters(null);
        Predicate result = spec.toPredicate(taskRoot, query, cb);

        assertThat(result).isEqualTo(predicate);
        verify(taskRoot).fetch("user");
        verify(cb).conjunction();
    }

    @Test
    @DisplayName("TaskSpecifications: should build search, status, and userId predicates")
    @SuppressWarnings("unchecked")
    void testTaskSpecsWithAllFilters() {
        doReturn(Long.class).when(query).getResultType(); // Count query (no fetch)
        UUID taskId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        TaskFiltersCommand filters =
                new TaskFiltersCommand(userId, taskId.toString(), TaskStatus.IN_PROGRESS);

        when(taskRoot.get(anyString())).thenReturn(taskPath);
        when(taskPath.get(anyString())).thenReturn(taskPath);

        Specification<TaskEntity> spec = TaskSpecifications.withFilters(filters);
        Predicate result = spec.toPredicate(taskRoot, query, cb);

        assertThat(result).isEqualTo(predicate);
        verify(taskRoot, never()).fetch("user");
        verify(cb).and(any(Predicate[].class));
    }
}
