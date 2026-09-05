package com.diegovilla.task_manager.core.security.jwt.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.diegovilla.task_manager.core.security.jwt.ports.AuthenticatedUserProvider;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

@ExtendWith(MockitoExtension.class)
class PermissionValidatorTest {

    @Mock private AuthenticatedUserProvider authenticatedUserProvider;

    @InjectMocks private PermissionValidator permissionValidator;

    @Test
    @DisplayName("Should return provided filterUserId when current user is admin")
    void shouldReturnFilterUserIdWhenAdmin() {
        UUID authUserId = UUID.randomUUID();
        UUID filterUserId = UUID.randomUUID();

        when(authenticatedUserProvider.getCurrentUserId()).thenReturn(authUserId);
        when(authenticatedUserProvider.isAdmin()).thenReturn(true);

        UUID result = permissionValidator.getTargetUserId(filterUserId);

        assertThat(result).isEqualTo(filterUserId);
    }

    @Test
    @DisplayName("Should return authenticatedUserId when current user is regular user")
    void shouldReturnAuthUserIdWhenRegularUser() {
        UUID authUserId = UUID.randomUUID();
        UUID filterUserId = UUID.randomUUID();

        when(authenticatedUserProvider.getCurrentUserId()).thenReturn(authUserId);
        when(authenticatedUserProvider.isAdmin()).thenReturn(false);

        UUID result = permissionValidator.getTargetUserId(filterUserId);

        assertThat(result).isEqualTo(authUserId);
    }

    @Test
    @DisplayName("Should allow access when user is admin")
    void shouldAllowWhenAdmin() {
        UUID taskUserId = UUID.randomUUID();
        when(authenticatedUserProvider.isAdmin()).thenReturn(true);
        when(authenticatedUserProvider.getCurrentUserId()).thenReturn(UUID.randomUUID());

        assertThatCode(() -> permissionValidator.validateHasPermissions(taskUserId))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("Should allow access when regular user is the task owner")
    void shouldAllowWhenOwner() {
        UUID ownerId = UUID.randomUUID();
        when(authenticatedUserProvider.isAdmin()).thenReturn(false);
        when(authenticatedUserProvider.getCurrentUserId()).thenReturn(ownerId);

        assertThatCode(() -> permissionValidator.validateHasPermissions(ownerId))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("Should throw AccessDeniedException when regular user is not the task owner")
    void shouldThrowWhenNotOwnerAndNotAdmin() {
        UUID authUserId = UUID.randomUUID();
        UUID taskUserId = UUID.randomUUID();
        when(authenticatedUserProvider.isAdmin()).thenReturn(false);
        when(authenticatedUserProvider.getCurrentUserId()).thenReturn(authUserId);

        assertThatThrownBy(() -> permissionValidator.validateHasPermissions(taskUserId))
                .isInstanceOf(AccessDeniedException.class);
    }
}
