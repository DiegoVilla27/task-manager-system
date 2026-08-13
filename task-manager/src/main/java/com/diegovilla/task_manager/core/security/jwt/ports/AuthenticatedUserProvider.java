package com.diegovilla.task_manager.core.security.jwt.ports;

import java.util.UUID;

public interface AuthenticatedUserProvider {
  UUID getCurrentUserId();
  String getCurrentUserRole();
  default boolean isAdmin() {
    return "ROLE_ADMIN".equalsIgnoreCase(getCurrentUserRole()) || "ADMIN".equalsIgnoreCase(getCurrentUserRole());
  }
}
