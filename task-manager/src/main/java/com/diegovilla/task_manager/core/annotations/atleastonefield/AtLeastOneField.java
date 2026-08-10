package com.diegovilla.task_manager.core.annotations.atleastonefield;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Bean Validation constraint that verifies at least one of the specified
 * fields contains a non-{@code null}, non-blank value.
 *
 * <p>This annotation must be applied at the type level and is validated
 * by {@link AtLeastOneFieldValidator}. It is typically used on partial
 * update DTOs where at least one field must be provided by the client.</p>
 *
 * <p>Example usage:</p>
 * <pre>{@code
 * @AtLeastOneField(
 *   fields = {"title", "description"},
 *   message = "At least one field must be provided"
 * )
 * public record UpdateDTO(String title, String description) { }
 * }</pre>
 *
 * @since 1.0.0
 */
@Documented
@Constraint(validatedBy = AtLeastOneFieldValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface AtLeastOneField {

  String message() default "At least one field must be provided";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  String[] fields();
}
