package com.diegovilla.task_manager.features.user.domain.valueobjects;

/**
 * Value object representing user authorization roles.
 *
 * @since 1.0.0
 */
public enum UserRole {
  /** Administrator role with elevated system privileges. */
  ADMIN,
  /** Standard user role with self-owned resource access privileges. */
  USER
}

