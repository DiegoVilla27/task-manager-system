package com.diegovilla.task_manager.core.security.jwt.ports;

import java.util.UUID;

/**
 * Inbound port interface providing access to current authenticated user identity and authorities.
 *
 * <p>Decouples application services from Spring Security context abstractions.</p>
 *
 * @since 1.0.0
 */
public interface AuthenticatedUserProvider {

  /**
   * Resolves the unique identifier of the currently authenticated user.
   *
   * @return the {@link UUID} of the authenticated principal.
   */
  UUID getCurrentUserId();

  /**
   * Resolves the authority role string of the currently authenticated user.
   *
   * @return the authority string (e.g. {@code "ROLE_ADMIN"} or {@code "ROLE_USER"}).
   */
  String getCurrentUserRole();

  /**
   * Checks whether the current authenticated user has administrator privileges.
   *
   * @return {@code true} if the user has an admin role; {@code false} otherwise.
   */
  default boolean isAdmin() {
    return "ROLE_ADMIN".equalsIgnoreCase(getCurrentUserRole()) || "ADMIN".equalsIgnoreCase(getCurrentUserRole());
  }
}

