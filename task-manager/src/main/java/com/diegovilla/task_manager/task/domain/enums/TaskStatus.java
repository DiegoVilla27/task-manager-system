package com.diegovilla.task_manager.task.domain.enums;

/**
 * Represents the lifecycle status of a task.
 *
 * <p>Tasks follow a linear state machine:</p>
 * <pre>
 *   PENDING → IN_PROGRESS → COMPLETED
 * </pre>
 *
 * @since 1.0.0
 */
public enum TaskStatus {
  /** Task has been created but not yet started. */
  PENDING,
  /** Task is currently being worked on. */
  IN_PROGRESS,
  /** Task has been finished. */
  COMPLETED
}
