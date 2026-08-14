package com.diegovilla.task_manager.core.security.jwt.adapters;

import com.diegovilla.task_manager.core.security.jwt.ports.AuthenticatedUserProvider;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Spring Security adapter implementing {@link AuthenticatedUserProvider}.
 *
 * <p>Reads the current authentication state from {@link SecurityContextHolder} to
 * extract the authenticated user UUID principal and granted authorities.</p>
 *
 * @since 1.0.0
 */
@Component
public class SpringSecurityUserProvider implements AuthenticatedUserProvider {

  /**
   * {@inheritDoc}
   *
   * @throws AccessDeniedException if no authentication exists or user ID is malformed.
   */
  @Override
  public UUID getCurrentUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated() || authentication.getName() == null) {
      throw new AccessDeniedException("No authenticated user found in security context");
    }

    try {
      // Retorna el UUID que guardaste como principal/name en el JwtAuthenticationFilter
      return UUID.fromString(authentication.getName());
    } catch (IllegalArgumentException e) {
      throw new AccessDeniedException("Invalid user ID format in security context");
    }
  }

  /**
   * {@inheritDoc}
   *
   * @throws AccessDeniedException if no authentication or authorities are found.
   */
  @Override
  public String getCurrentUserRole() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || authentication.getAuthorities().isEmpty()) {
      throw new AccessDeniedException("No authorities found for current user");
    }

    return authentication.getAuthorities().iterator().next().getAuthority();
  }
}

