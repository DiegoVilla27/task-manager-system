package com.diegovilla.task_manager.core.errors.factories;

import com.diegovilla.task_manager.core.errors.dtos.FieldErrorDTO;
import org.springframework.stereotype.Component;

/**
 * Factory responsible for creating {@link FieldErrorDTO} instances.
 *
 * <p>Centralizing the creation of field-level validation errors provides
 * a single extension point for future transformations or formatting
 * without impacting the exception handlers.</p>
 *
 * @since 1.0.0
 */
@Component
public class FieldErrorFactory {

  /**
   * Creates a field-level validation error.
   *
   * @param field   name of the field that caused the error.
   * @param value   rejected value received from the client.
   * @param message human-readable description of the validation error.
   * @return a new {@link FieldErrorDTO}.
   */
  public FieldErrorDTO build(
    String field,
    Object value,
    String message) {

    return new FieldErrorDTO(
      field,
      value,
      message
    );
  }
}
