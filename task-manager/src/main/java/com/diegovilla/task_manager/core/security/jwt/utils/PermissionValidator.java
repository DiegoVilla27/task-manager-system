package com.diegovilla.task_manager.core.security.jwt.utils;

import com.diegovilla.task_manager.core.security.jwt.ports.AuthenticatedUserProvider;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Utility component enforcing role-based and ownership-based permission rules.
 *
 * <p>Determines query filtering constraints based on whether the authenticated principal
 * is an administrator or standard user, and validates ownership before mutation operations.</p>
 *
 * @since 1.0.0
 */
@Component
@RequiredArgsConstructor
public class PermissionValidator {

  private final AuthenticatedUserProvider authenticatedUserProvider;

  /**
   * Resolves the target user ID for query filtering based on the authenticated user's role.
   *
   * <p>If the authenticated user has an {@code ADMIN} role, the provided filter user ID is respected
   * (allowing admins to search all tasks or filter by a specific user). If the authenticated user has a
   * {@code USER} role, any incoming filter user ID is ignored and forced to the authenticated user's ID.</p>
   *
   * @param filterUserId the optional target user ID requested in query filters.
   * @return the effective target user ID to apply in database query specifications, or {@code null} if searching all tasks.
   */
  public @Nullable UUID getTargetUserId(UUID filterUserId) {
    UUID authenticatedUserId = authenticatedUserProvider.getCurrentUserId();
    boolean isAdmin = authenticatedUserProvider.isAdmin();

    UUID targetUserId;
    if (isAdmin) {
      targetUserId = filterUserId;
    } else {
      targetUserId = authenticatedUserId;
    }
    return targetUserId;
  }

  /**
   * Validates whether the currently authenticated user has permissions to access or mutate a task.
   *
   * <p>Users with {@code ROLE_ADMIN} are granted unrestricted access. Users with {@code ROLE_USER} are
   * restricted to tasks that they own.</p>
   *
   * @param taskUserId unique identifier of the user who owns the task.
   * @throws AccessDeniedException if a regular user attempts to access a task owned by another user.
   */
  public void validateHasPermissions(UUID taskUserId) {
    boolean isUserRole = !authenticatedUserProvider.isAdmin();
    boolean isOwner = authenticatedUserProvider.getCurrentUserId().equals(taskUserId);

    if (isUserRole && !isOwner) {
      throw new AccessDeniedException("");
    }
  }
}
